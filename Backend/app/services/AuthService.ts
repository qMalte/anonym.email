import {User} from "../models/User";
import bcrypt from "bcrypt";
import {Session} from "../models/Session";
import {StringHelper} from "../../helpers/StringHelper";
import {DateHelper} from "../../helpers/DateHelper";
import {AppDataSource} from "../../database/DatabaseProvider";
import {PasswordResetLink} from "../models/PasswordResetLink";
import {NumericHelper} from "../../helpers/NumericHelper";
import {MailService, Template} from "./MailService";
import {FailedLogin} from "../models/FailedLogin";
import {BlacklistedIP} from "../models/BlacklistedIP";
import {MoreThan} from "typeorm";
import {UserService} from "./UserService";

export class AuthService {

    async login(password: string, ip: string, username: string = null, email: string = null, pubKey: string = null): Promise<Session> {

        if (ip.includes("::ffff:")) {
            ip = ip.replace('::ffff:', '');
        }

        const userRepo = AppDataSource.getRepository(User);

        if ((username == null && email == null) || password == null || (username != null && email != null)) {
            // Username and E-Mail given, password is empty or username and password is empty
            return null;
        }

        let user: User = null;

        if (username != null) {
            user = await userRepo.findOneBy({
                username: username.toLowerCase()
            });
        } else if (email != null) {
            user = await userRepo.findOneBy({
                email: email.toLowerCase()
            });
        }

        if (user == null) {
            await this.setFailedLogin(ip);
            return null;
        }

        if (await bcrypt.compare(password, user.password) && ip != null) {
            return await this.createSession(user, ip, pubKey);
        } else {
            await this.setFailedLogin(ip, user);
            return null;
        }
    }

    async createSession(user: User, ip: string, pubKey: string): Promise<Session> {

        if (ip.includes("::ffff:")) {
            ip = ip.replace('::ffff:', '');
        }

        const sessionRepo = AppDataSource.getRepository(Session);

        const session = new Session();
        session.user_id = user.id;
        session.ip = ip;
        session.secretDecrypted = StringHelper.Generate(128);
        session.prefix = session.secretDecrypted.substring(0, 16);
        session.secret = await bcrypt.hash(session.secretDecrypted, 10);
        session.expired_at = DateHelper.addMinutes(60);

        if (pubKey != null) {
            session.pubKey = pubKey;
        }

        return await sessionRepo.save(session);
    }

    async passwordReset(user: User) {
        const resetLinkRepo = AppDataSource.getRepository(PasswordResetLink);

        const currentLinks = await resetLinkRepo.findBy({
            user_id: user.id
        });

        for (const passwordResetLink of currentLinks) {
            if (passwordResetLink.expired_at > new Date()) {
                passwordResetLink.expired_at = new Date();
                await resetLinkRepo.save(passwordResetLink);
            }
        }

        const link = new PasswordResetLink();
        link.user_id = user.id;
        link.expired_at = DateHelper.addMinutes(5);
        link.code = NumericHelper.Generate(6);

        while (await resetLinkRepo.countBy({
            code: link.code
        }) > 0) {
            link.code = NumericHelper.Generate(6);
        }

        await resetLinkRepo.save(link);

        const mail = new MailService(user.email, 'Zurücksetzung des Passworts',
                Template.PASSWORD_RESET_REQ, [link.code.toString()]);

        return await mail.send();

    }

    async setPassword(email: string, securityCode: number, password: string): Promise<boolean> {
        const resetLinkRepo = AppDataSource.getRepository(PasswordResetLink);
        const userRepo = AppDataSource.getRepository(User);

        const passwordResetLink = await resetLinkRepo.findOneBy({
            code: securityCode
        });

        const user = await userRepo.findOneBy({
            email
        });

        if (user == null || passwordResetLink == null) {
            return false;
        }

        if (user.id !== passwordResetLink.user_id) {
            return false;
        }

        if (passwordResetLink.expired_at < new Date()) {
            return false;
        }

        if (passwordResetLink.code !== securityCode) {
            return false;
        }

        passwordResetLink.expired_at = new Date();
        await resetLinkRepo.save(passwordResetLink);

        user.password = await bcrypt.hash(password, 10);
        await userRepo.save(user);

        const mail = new MailService(user.email, 'Passwort Änderung',
            Template.PASSWORD_RESET_SUCCESS);

        return await mail.send();

    }

    async setFailedLogin(ip: string, user: User = null) {
        const failedLoginRepo = AppDataSource.getRepository(FailedLogin);

        let failedLogin = await failedLoginRepo.findOneBy({
            ip,
            created_at: MoreThan(DateHelper.removeMinutes(4))
        });

        if (failedLogin != null) {
            failedLogin.counter++;
        } else {
            failedLogin = new FailedLogin();
            failedLogin.ip = ip;
            failedLogin.created_at = new Date();
            failedLogin.counter = 1;
        }

        if (user != null) {
            failedLogin.user_id = user.id;
        }

        await failedLoginRepo.save(failedLogin);

        if (failedLogin.counter >= 10) {
            const blacklistedIPRepo = AppDataSource.getRepository(BlacklistedIP);
            const ipStatus = await this.isIPBlocked(ip);

            if (ipStatus === false) {
                const ipBlock = new BlacklistedIP();
                ipBlock.ip = ip;
                ipBlock.expired_at = DateHelper.addMinutes(10);
                ipBlock.created_at = new Date();
                await blacklistedIPRepo.save(ipBlock);
            } else {
                const ipEntry = await blacklistedIPRepo.findOneBy({
                    id: +ipStatus
                });

                ipEntry.expired_at = DateHelper.addMinutes(10);
                await blacklistedIPRepo.save(ipEntry);
            }

        }

    }

    async isIPBlocked(ip: string): Promise<number | boolean> {
        const ipRepo = AppDataSource.getRepository(BlacklistedIP);

        const ips = await ipRepo.findBy({
            ip
        });

        for (const ipEntry of ips) {
            if (ipEntry.expired_at > new Date()) {
                return ipEntry.id;
            }
        }

        return false;
    }

    async register(username: string, email: string, password: string) {

        const userRepo = AppDataSource.getRepository(User);

        const user = new User();
        user.username = username;
        user.email = email;
        user.password = await bcrypt.hash(password, 10);
        user.verifyCode = NumericHelper.Generate(6);

        try {
            await UserService.sendVerificationMail(user);
            await userRepo.save(user);
            return true;
        } catch (e) {
            return false;
        }

    }

    async registerConfirm(username: string, email: string, token: number) {

        const userRepo = AppDataSource.getRepository(User);

        try {
            const user = await userRepo.findOneBy({
                username, email, verifyCode: token
            });

            if (user != null && !user.verified) {
                user.verified = true;
                await userRepo.save(user);
                return 200;
            } else {
                return 400;
            }

        } catch (e) {
            return 500;
        }

    }

}
