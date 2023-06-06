import express from "express";
import {User} from "../models/User";
import {Session} from "../models/Session";
import {AppDataSource} from "../../database/DatabaseProvider";
import {UserService} from "../services/UserService";
import validator from "validator";
import bcrypt from "bcrypt";
import {MailService} from "../services/MailService";
import {MailChangeRequest} from "../models/MailChangeRequest";
import {DateHelper} from "../../helpers/DateHelper";
import {NumericHelper} from "../../helpers/NumericHelper";
import {RSAService} from "../services/RSAService";
import {Permission} from "../models/Permission";
import {SystemResources} from "../../resources/SystemResources";
import {AuthenticationResources} from "../../resources/AuthenticationResources";
import {ValidationResources} from "../../resources/ValidationResources";

export class UserController {

    async GetUser(req: express.Request, res: express.Response) {
        const userRepo = AppDataSource.getRepository(User);

        if (res.locals.user_id == null) {
            return res.status(500).send(SystemResources.ServerError);
        }

        const session: Session = res.locals.session;
        const pubKey = session.pubKey;
        const user: User = await userRepo.findOneBy({
            id: res.locals.user_id
        });
        delete user.password;
        delete user.id;
        res.status(200).send({
            ec: false,
            data: user
        });
    }

    async GetSession(req: express.Request, res: express.Response) {
        const sessionRepo = AppDataSource.getRepository(Session);

        const session = await sessionRepo.findOneBy({
            prefix: req.header("Authorization").substring(0, 16)
        });

        if (session == null) {
            return res.status(500).send(SystemResources.ServerError);
        }

        delete session.id;
        delete session.secret;
        delete session.prefix;
        delete session.secretDecrypted;
        delete session.user_id;
        delete session.ip;

        res.status(200).send(session);
    }

    async GetUsers(req: express.Request, res: express.Response) {

        if (!await UserService.hasPermission(res.locals.user_id, 'users', false)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        const userRepo = AppDataSource.getRepository(User);
        const users = await userRepo.find();

        users.forEach((user: User) => {
            delete user.password;
            delete user.otpSecret;
        });

        return res.status(200).send(users);

    }

    async PutChangePassword(req: express.Request, res: express.Response) {

        if (req.body.password == null || req.body.password == "") {
            return res.status(400).send({
                reason: 'password_required'
            });
        }

        const userRepo = AppDataSource.getRepository(User);

        const user = await userRepo.findOneBy({
            id: res.locals.user_id
        });

        if (user == null) {
            return res.status(500).end();
        }

        user.password = await bcrypt.hash(req.body.password, 10);
        await userRepo.save(user);

        const message = `Hallo ${user.firstname},\n\n
mit dieser E-Mail bestätigen wir die Änderung deines Passworts!\n
Solltest du keine Änderung deines Passwortes durchgeführt haben, kontaktiere uns schnellstmöglich!\n
Wir werden dann eine umgehende Sperrung deines Account einleiten.\n
\n\n
Mit freundlichen Grüßen\n
StepOne e.V.`;

        await new MailService(user.email, 'Passwort Änderung', message).send();

        res.status(200).end();

    }

    async PutChangeMail(req: express.Request, res: express.Response) {

        if (req.body.email == null || req.body.email == "") {
            return res.status(400).send({
                reason: 'email_required'
            });
        }

        if (!validator.isEmail(req.body.email.toString())) {
            return res.status(400).send(ValidationResources.MailFormat);
        }

        const userRepo = AppDataSource.getRepository(User);
        const mailChangeRequestsRepo = AppDataSource.getRepository(MailChangeRequest);

        const user = await userRepo.findOneBy({
            id: res.locals.user_id
        });

        if (await userRepo.countBy({
            email: req.body.email
        }) > 0) {
            return res.status(400).send(ValidationResources.MultipleMailFormat);
        }

        const request = new MailChangeRequest();
        request.user_id = res.locals.user_id;
        request.email = req.body.email;
        request.expire_at = DateHelper.addMinutes(10);
        request.newMailToken = NumericHelper.Generate(6);
        request.oldMailToken = NumericHelper.Generate(6);
        request.newMailVerified = false;
        request.oldMailVerified = false;
        await mailChangeRequestsRepo.save(request);

        const messageToOldAddress = `Hallo ${user.firstname},\n\n
hiermit erhälst du als Inhaber des Accounts einen Bestätigungscode, um zu verifizieren, dass die Änderung deiner E-Mail beabsichtigt ist.\n
Nach erfolgter Bestätigung wird deine E-Mail: ${user.email} zu: ${request.email} umgestellt.\n
Dein Sicherheitscode lautet: ${request.oldMailToken}\n
\n\n
Mit freundlichen Grüßen\n
StepOne e.V.`;

        const messageToNewAddress = `Hallo ${user.firstname},\n\n
hiermit erhälst du als Inhaber der E-Mail Adresse: ${request.email} einen Bestätigungscode, um die Echtheit der E-Mail zu bestätigen.\n
Nach erfolgter Bestätigung wird dein Account von: ${user.email} zu: ${request.email} umgestellt.\n
Dein Sicherheitscode lautet: ${request.newMailToken}\n
\n\n
Mit freundlichen Grüßen\n
StepOne e.V.`;

        await new MailService(request.email, 'E-Mail Validierung', messageToNewAddress).send();
        await new MailService(user.email, 'Sicherheitsüberprüfung', messageToOldAddress).send();

        res.status(200).end();

    }

    async PostChangeMail(req: express.Request, res: express.Response) {

        if (req.body.token == null) {
            return res.status(400).send({
                reason: 'token_required'
            });
        }

        if (!validator.isNumeric(req.body.token.toString())) {
            return res.status(400).send({
                reason: 'token_haveTo_numeric'
            });
        }

        const userRepo = AppDataSource.getRepository(User);
        const mailChangeRequestsRepo = AppDataSource.getRepository(MailChangeRequest);

        let request = await mailChangeRequestsRepo.findOneBy({
            user_id: res.locals.user_id,
            newMailToken: req.body.token
        });

        let verified = false;
        if (request == null) {
            request = await mailChangeRequestsRepo.findOneBy({
                user_id: res.locals.user_id,
                oldMailToken: req.body.token
            });

            if (request != null && request.expire_at > new Date() && !request.oldMailVerified) {
                request.oldMailVerified = true;
                verified = true;
            }

        } else {
            if (request.expire_at > new Date() && !request.newMailVerified) {
                request.newMailVerified = true;
                verified = true;
            }
        }

        await mailChangeRequestsRepo.save(request);

        if (request != null && request.newMailVerified && request.oldMailVerified) {
            const mailCheck = await userRepo.findOneBy({
                email: request.email
            });

            if (mailCheck == null) {
                const user = await userRepo.findOneBy({
                    id: res.locals.user_id
                });

                user.email = request.email;
                await userRepo.save(user);
                return res.status(200).end('mail_change_success');
            } else {
                return res.status(400).end('mail_already_inUse');
            }
        }

        if (verified) {
            return res.status(200).end('mail_verified_success');
        }

        res.status(400).end();

    }

    async PutUser(req: express.Request, res: express.Response) {

        const errors = [];

        if (req.body.firstname != null)
            if (!await UserService.checkAndChangeData(req.body.firstname, 'firstname', res.locals.user_id))
                errors.push('validation_failed_firstname');
        if (req.body.lastname != null)
            if (!await UserService.checkAndChangeData(req.body.lastname, 'lastname', res.locals.user_id))
                errors.push('validation_failed_firstname');
        if (req.body.birthday != null)
            if (!await UserService.checkAndChangeData(req.body.birthday, 'birthday', res.locals.user_id))
                errors.push('validation_failed_firstname');
        if (req.body.phone != null)
            if (!await UserService.checkAndChangeData(req.body.phone, 'phone', res.locals.user_id))
                errors.push('validation_failed_firstname');
        if (req.body.street != null)
            if (!await UserService.checkAndChangeData(req.body.street, 'street', res.locals.user_id))
                errors.push('validation_failed_firstname');
        if (req.body.houseNr != null)
            if (!await UserService.checkAndChangeData(req.body.houseNr, 'houseNr', res.locals.user_id))
                errors.push('validation_failed_firstname');
        if (req.body.zip != null)
            if (!await UserService.checkAndChangeData(req.body.zip, 'zip', res.locals.user_id))
                errors.push('validation_failed_firstname');
        if (req.body.city != null)
            if (!await UserService.checkAndChangeData(req.body.city, 'city', res.locals.user_id))
                errors.push('validation_failed_firstname');
        if (req.body.county != null)
            if (!await UserService.checkAndChangeData(req.body.county, 'country', res.locals.user_id))
                errors.push('validation_failed_firstname');
        if (req.body.nationality != null)
            if (!await UserService.checkAndChangeData(req.body.nationality, 'nationality', res.locals.user_id))
                errors.push('validation_failed_firstname');

        if (errors.length > 0) {
            res.status(400).send(errors);
        } else {
            res.status(200).end();
        }
    }

    async PutUsername(req: express.Request, res: express.Response) {

        const userRepo = AppDataSource.getRepository(User);

        if (req.body.username == null) {
            return res.status(400).send({
                reason: 'username_required'
            });
        }

        if (!validator.isAlpha(req.body.username.toString())) {
            return res.status(400).send({
                reason: 'username_validation_failed'
            });
        }

        if (await userRepo.countBy({username: req.body.username}) > 0) {
            return res.status(400).send({
                reason: 'username_already_inUse'
            });
        }

        const user = await userRepo.findOneBy({
            id: res.locals.user_id
        });

        user.username = req.body.username;
        await userRepo.save(user);

        res.status(200).end();

    }

    async PutManageUser(req: express.Request, res: express.Response) {

        if (!await UserService.hasPermission(res.locals.user_id, 'users', true)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        if (req.body.user_id == null || !validator.isNumeric(req.body.user_id.toString())) {
            return res.status(403).send({
                reason: 'userId_not_provided'
            });
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({
            id: req.body.user_id
        });

        const errors = [];

        if (req.body.firstname != null)
            if (!await UserService.checkAndChangeData(req.body.firstname, 'firstname', user.id))
                errors.push('validation_failed_firstname');
        if (req.body.lastname != null)
            if (!await UserService.checkAndChangeData(req.body.lastname, 'lastname', user.id))
                errors.push('validation_failed_lastname');
        if (req.body.birthday != null)
            if (!await UserService.checkAndChangeData(req.body.birthday, 'birthday', user.id))
                errors.push('validation_failed_birthday');
        if (req.body.phone != null)
            if (!await UserService.checkAndChangeData(req.body.phone, 'phone', user.id))
                errors.push('validation_failed_phone');
        if (req.body.street != null)
            if (!await UserService.checkAndChangeData(req.body.street, 'street', user.id))
                errors.push('validation_failed_street');
        if (req.body.houseNr != null)
            if (!await UserService.checkAndChangeData(req.body.houseNr, 'houseNr', user.id))
                errors.push('validation_failed_houseNr');
        if (req.body.zip != null)
            if (!await UserService.checkAndChangeData(req.body.zip, 'zip', user.id))
                errors.push('validation_failed_zip');
        if (req.body.city != null)
            if (!await UserService.checkAndChangeData(req.body.city, 'city', user.id))
                errors.push('validation_failed_city');
        if (req.body.county != null)
            if (!await UserService.checkAndChangeData(req.body.county, 'country', user.id))
                errors.push('validation_failed_country');
        if (req.body.nationality != null)
            if (!await UserService.checkAndChangeData(req.body.nationality, 'nationality', user.id))
                errors.push('validation_failed_nationality');
        if (req.body.username != null && !(await UserService.usernameAlreadyExists(req.body.username)))
            if (!await UserService.checkAndChangeData(req.body.username, 'username', user.id))
                errors.push('validation_failed_username');
        if (req.body.email != null && !(await UserService.mailAlreadyExists(req.body.email)))
            if (!await UserService.checkAndChangeData(req.body.email, 'email', user.id))
                errors.push('validation_failed_email');
        if (req.body.isActive != null)
            if (!await UserService.checkAndChangeData(req.body.isActive, 'isActive', user.id))
                errors.push('validation_failed_isActive');
        if (req.body.otpActive != null)
            if (!await UserService.checkAndChangeData(req.body.otpActive, 'otpActive', user.id))
                errors.push('validation_failed_otpActive');
        if (req.body.verified != null)
            if (!await UserService.checkAndChangeData(req.body.verified, 'verified', user.id))
                errors.push('validation_failed_verified');

        if (errors.length > 0) {
            res.status(400).send(errors);
        } else {
            res.status(200).end();
        }

    }

    async GetPermissions(req: express.Request, res: express.Response) {
        const userRepo = AppDataSource.getRepository(User);
        const permissionRepo = AppDataSource.getRepository(Permission);

        const user = await userRepo.findOneBy({
            id: res.locals.user_id
        });

        const permissionAssignmentsUser = await UserService.getPermissionAssignmentsByUser(user);

        for (const item of permissionAssignmentsUser) {
            item.permission = await permissionRepo.findOneBy({id: item.permission_id})
            delete item.createdAt;
            delete item.updatedAt;
            delete item.user_id;
            delete item.group_id;
            delete item.permission_id;
        }

        return res.status(200).send(permissionAssignmentsUser)
    }

}
