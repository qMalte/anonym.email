import express from "express";
import validator from 'validator';
import {Session} from "../models/Session";
import {AppDataSource} from "../../database/DatabaseProvider";
import {User} from "../models/User";
import {authenticator, totp} from 'otplib';
import {DateHelper} from "../../helpers/DateHelper";
import {RSAService} from "../services/RSAService";
import {UserService} from "../services/UserService";
import bcrypt from "bcrypt";
import {ServiceRegistry} from "../services/ServiceRegistry";
import {ValidationResources} from "../../resources/ValidationResources";
import {AuthenticationResources} from "../../resources/AuthenticationResources";
import {SystemResources} from "../../resources/SystemResources";

export class AuthController {

    async PostLogin(req: express.Request, res: express.Response) {
        try {
            const userRepo = AppDataSource.getRepository(User);

            if (req.body.login == null) {
                return res.status(400).send(ValidationResources.EmptyLogin);
            }

            if (req.body.password == null) {
                return res.status(400).send(ValidationResources.EmptyPassword);
            }

            let login: string;
            let password: string;
            let pubKey = null;

            const regex = new RegExp('-*BEGIN PUBLIC KEY-*\\r?\\n?[A-Za-z0-9\\/\\r?\\n?+=]*-*END PUBLIC KEY-*\\r?\\n?');
            if (req.body.pubKey != null && regex.test(req.body.pubKey)) {
                pubKey = req.body.pubKey;
            }

            if (req.body.ec != null && req.body.ec) {
                login = RSAService.decrypt(req.body.login);
                password = RSAService.decrypt(req.body.password);
            } else {
                login = req.body.login;
                password = req.body.password;
            }

            let session: Session | null;
            if (login != null && login.includes('@') && validator.isEmail(login)) {
                session = await ServiceRegistry.Auth.login(password, req.ip, null, login, pubKey);
            } else {
                session = await ServiceRegistry.Auth.login(password, req.ip, login, null, pubKey);
            }

            if (session != null) {
                const user = await userRepo.findOneBy({
                    id: session.user_id
                })
                res.status(200).send({
                    ec: pubKey != null,
                    otpActive: user.otpActive,
                    isVerified: session.isVerified,
                    secret: pubKey != null ? RSAService.encrypt(session.secretDecrypted, pubKey) : session.secretDecrypted,
                    expire_at: session.expired_at
                });
            } else {
                res.status(401).send(AuthenticationResources.BadCredentials);
            }
        } catch (e) {
            return res.status(500).send(SystemResources.ServerError);
        }
    }

    async PostLogout(req: express.Request, res: express.Response) {
        try {
            const sessionRepo = AppDataSource.getRepository(Session);

            const session = await sessionRepo.findOneBy({
                prefix: req.header("Authorization").substring(0, 16)
            });

            if (session == null) {
                return res.status(500).end();
            }

            session.expired_at = new Date();
            await sessionRepo.save(session);

            res.status(200).end();
        } catch (e) {
            return res.status(500).send(SystemResources.ServerError);
        }
    }

    async PostOTP(req: express.Request, res: express.Response) {
        const userRepo = AppDataSource.getRepository(User);
        const sessionRepo = AppDataSource.getRepository(Session);

        if (res.locals.user_id == null) {
            return res.status(500).send(SystemResources.ServerError);
        }

        if (req.body.token == null) {
            return res.status(400).send(ValidationResources.MissingOtpToken);
        }

        const user = await userRepo.findOneBy({
            id: res.locals.user_id
        });

        const isValid = authenticator.check(req.body.token, user.otpSecret);
        if (isValid) {
            const session = await sessionRepo.findOneBy({
                prefix: req.header("Authorization").substring(0, 16)
            });
            session.isVerified = true;
            session.expired_at = DateHelper.addMinutes(10);
            await sessionRepo.save(session);
            return res.status(200).end();
        } else {
            return res.status(403).send(AuthenticationResources.BadOtp);
        }

    }

    async PostResetPasswordRequest(req: express.Request, res: express.Response) {
        const userRepo = AppDataSource.getRepository(User);

        if (req.body.email == null) {
            return res.status(400).send(ValidationResources.MissingMailToResetPassword);
        }

        const user = await userRepo.findOneBy({
            email: req.body.email
        });

        if (user == null) {
            return res.status(400).send({
                reason: 'Could not find User with given E-Mail Address!'
            });
        }

        if (await ServiceRegistry.Auth.passwordReset(user)) {
            return res.status(200).end();
        }

        res.status(500).send(SystemResources.ServerError);

    }

    async PostPasswordReset(req: express.Request, res: express.Response) {

        if (req.body.email == null || req.body.code == null || req.body.password == null) {
            return res.status(400).send(ValidationResources.MissingDataPasswordReset);
        }

        if (!validator.isEmail(req.body.email)) {
            return res.status(400).send(ValidationResources.MailFormat);
        }

        if (!validator.isNumeric(req.body.code.toString())) {
            return res.status(400).send(ValidationResources.SecurityCode);
        }

        if (await ServiceRegistry.Auth.setPassword(req.body.email, req.body.code, req.body.password)) {
            res.status(200).end();
        } else {
            res.status(403).send(AuthenticationResources.FailedPasswordReset);
        }

    }

    async PostRegister(req: express.Request, res: express.Response) {

        // Disable Registration
        return res.status(400).send(AuthenticationResources.RegistrationDisabled);

        if (req.body.email == null || req.body.username == null || req.body.password == null) {
            return res.status(400).send(ValidationResources.RegisterData);
        }

        if (!validator.isEmail(req.body.email.toString())) {
            return res.status(400).send(ValidationResources.MailFormat);
        }

        if (!validator.isAlpha(req.body.username.toString())) {
            return res.status(400).send(ValidationResources.UsernameFormat);
        }

        if (await UserService.mailAlreadyExists(req.body.email)) {
            return res.status(400).send(ValidationResources.MultipleMailFormat);
        }

        if (await UserService.usernameAlreadyExists(req.body.username)) {
            return res.status(400).send(ValidationResources.MultipleUsernameFormat);
        }

        let username = null;
        let password = null;
        let email = null;
        if (req.body.ec != null && req.body.ec) {
            username = RSAService.decrypt(req.body.username);
            password = RSAService.decrypt(req.body.password);
            email = RSAService.decrypt(req.body.email);
        } else {
            username = req.body.username;
            password = req.body.password;
            email = req.body.email;
        }

        if (await ServiceRegistry.Auth.register(username, email, password)) {
            return res.status(200).end();
        } else {
            return res.status(500).send(SystemResources.ServerError);
        }

    }

    async PostRegisterConfirm(req: express.Request, res: express.Response) {

        // Disable Registration
        return res.status(400).send(AuthenticationResources.RegistrationDisabled);

        if (req.body.email == null || req.body.username == null || req.body.token == null) {
            return res.status(400).send(ValidationResources.RegisterData);
        }

        if (!validator.isNumeric(req.body.token.toString())) {
            return res.status(400).send(ValidationResources.SecurityCode);
        }

        let username = null;
        let token = null;
        let email = null;
        if (req.body.ec != null && req.body.ec) {
            username = RSAService.decrypt(req.body.username);
            token = RSAService.decrypt(req.body.token);
            email = RSAService.decrypt(req.body.email);
        } else {
            username = req.body.username;
            token = req.body.token;
            email = req.body.email;
        }

        const state = await ServiceRegistry.Auth.registerConfirm(username, email, token);
        return res.status(state).end();

    }

    async PostEnableOTP(req: express.Request, res: express.Response) {

        if (req.body.otpCode == null || req.body.password == null) {
            return res.status(400).send(ValidationResources.OtpEnableParams);
        }

        if (!validator.isNumeric(req.body.otpCode.toString())) {
            return res.status(400).send(ValidationResources.OtpCodeFormat);
        }

        let otpCode = null;
        let password = null;

        if (req.body.ec != null && req.body.ec) {
            otpCode = RSAService.decrypt(req.body.otpCode);
            password = RSAService.decrypt(req.body.password);
        } else {
            otpCode = req.body.otpCode;
            password = req.body.password;
        }

        const userRepo = AppDataSource.getRepository(User);
        const sessionRepo = AppDataSource.getRepository(Session);
        const user = await userRepo.findOneBy({id: res.locals.user_id});

        if (!(await bcrypt.compare(password, user.password))) {
            return res.status(400).send(AuthenticationResources.BadCredentials);
        }

        const isValid = authenticator.check(otpCode, user.otpSecret);
        if (isValid) {
            const session: Session = res.locals.session;
            session.isVerified = true;
            user.otpActive = true;
            await userRepo.save(user);
            await sessionRepo.save(session);
            return res.status(200).end();
        } else {
            return res.status(400).send(AuthenticationResources.BadOtp);
        }

    }

    async PostDisableOTP(req: express.Request, res: express.Response) {

        if (req.body.password == null) {
            return res.status(400).send({
                reason: 'validation_failed',
                require_params: [
                    'password'
                ]
            });
        }

        let password = null;

        if (req.body.ec != null && req.body.ec) {
            password = RSAService.decrypt(req.body.password);
        } else {
            password = req.body.password;
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({id: res.locals.user_id});

        if (await bcrypt.compare(password, user.password)) {
            user.otpActive = false;
            await userRepo.save(user);
            return res.status(200).end();
        } else {
            return res.status(400).send({
                reason: 'password_validation_failed'
            });
        }

    }

}
