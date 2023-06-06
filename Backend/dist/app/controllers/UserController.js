"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const User_1 = require("../models/User");
const Session_1 = require("../models/Session");
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
const UserService_1 = require("../services/UserService");
const validator_1 = __importDefault(require("validator"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const MailService_1 = require("../services/MailService");
const MailChangeRequest_1 = require("../models/MailChangeRequest");
const DateHelper_1 = require("../../helpers/DateHelper");
const NumericHelper_1 = require("../../helpers/NumericHelper");
const Permission_1 = require("../models/Permission");
const SystemResources_1 = require("../../resources/SystemResources");
const AuthenticationResources_1 = require("../../resources/AuthenticationResources");
const ValidationResources_1 = require("../../resources/ValidationResources");
class UserController {
    GetUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            if (res.locals.user_id == null) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
            const session = res.locals.session;
            const pubKey = session.pubKey;
            const user = yield userRepo.findOneBy({
                id: res.locals.user_id
            });
            delete user.password;
            delete user.id;
            res.status(200).send({
                ec: false,
                data: user
            });
        });
    }
    GetSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const sessionRepo = DatabaseProvider_1.AppDataSource.getRepository(Session_1.Session);
            const session = yield sessionRepo.findOneBy({
                prefix: req.header("Authorization").substring(0, 16)
            });
            if (session == null) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
            delete session.id;
            delete session.secret;
            delete session.prefix;
            delete session.secretDecrypted;
            delete session.user_id;
            delete session.ip;
            res.status(200).send(session);
        });
    }
    GetUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'users', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const users = yield userRepo.find();
            users.forEach((user) => {
                delete user.password;
                delete user.otpSecret;
            });
            return res.status(200).send(users);
        });
    }
    PutChangePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.password == null || req.body.password == "") {
                return res.status(400).send({
                    reason: 'password_required'
                });
            }
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepo.findOneBy({
                id: res.locals.user_id
            });
            if (user == null) {
                return res.status(500).end();
            }
            user.password = yield bcrypt_1.default.hash(req.body.password, 10);
            yield userRepo.save(user);
            const message = `Hallo ${user.firstname},\n\n
mit dieser E-Mail bestätigen wir die Änderung deines Passworts!\n
Solltest du keine Änderung deines Passwortes durchgeführt haben, kontaktiere uns schnellstmöglich!\n
Wir werden dann eine umgehende Sperrung deines Account einleiten.\n
\n\n
Mit freundlichen Grüßen\n
StepOne e.V.`;
            yield new MailService_1.MailService(user.email, 'Passwort Änderung', message).send();
            res.status(200).end();
        });
    }
    PutChangeMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.email == null || req.body.email == "") {
                return res.status(400).send({
                    reason: 'email_required'
                });
            }
            if (!validator_1.default.isEmail(req.body.email.toString())) {
                return res.status(400).send(ValidationResources_1.ValidationResources.MailFormat);
            }
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const mailChangeRequestsRepo = DatabaseProvider_1.AppDataSource.getRepository(MailChangeRequest_1.MailChangeRequest);
            const user = yield userRepo.findOneBy({
                id: res.locals.user_id
            });
            if ((yield userRepo.countBy({
                email: req.body.email
            })) > 0) {
                return res.status(400).send(ValidationResources_1.ValidationResources.MultipleMailFormat);
            }
            const request = new MailChangeRequest_1.MailChangeRequest();
            request.user_id = res.locals.user_id;
            request.email = req.body.email;
            request.expire_at = DateHelper_1.DateHelper.addMinutes(10);
            request.newMailToken = NumericHelper_1.NumericHelper.Generate(6);
            request.oldMailToken = NumericHelper_1.NumericHelper.Generate(6);
            request.newMailVerified = false;
            request.oldMailVerified = false;
            yield mailChangeRequestsRepo.save(request);
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
            yield new MailService_1.MailService(request.email, 'E-Mail Validierung', messageToNewAddress).send();
            yield new MailService_1.MailService(user.email, 'Sicherheitsüberprüfung', messageToOldAddress).send();
            res.status(200).end();
        });
    }
    PostChangeMail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.token == null) {
                return res.status(400).send({
                    reason: 'token_required'
                });
            }
            if (!validator_1.default.isNumeric(req.body.token.toString())) {
                return res.status(400).send({
                    reason: 'token_haveTo_numeric'
                });
            }
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const mailChangeRequestsRepo = DatabaseProvider_1.AppDataSource.getRepository(MailChangeRequest_1.MailChangeRequest);
            let request = yield mailChangeRequestsRepo.findOneBy({
                user_id: res.locals.user_id,
                newMailToken: req.body.token
            });
            let verified = false;
            if (request == null) {
                request = yield mailChangeRequestsRepo.findOneBy({
                    user_id: res.locals.user_id,
                    oldMailToken: req.body.token
                });
                if (request != null && request.expire_at > new Date() && !request.oldMailVerified) {
                    request.oldMailVerified = true;
                    verified = true;
                }
            }
            else {
                if (request.expire_at > new Date() && !request.newMailVerified) {
                    request.newMailVerified = true;
                    verified = true;
                }
            }
            yield mailChangeRequestsRepo.save(request);
            if (request != null && request.newMailVerified && request.oldMailVerified) {
                const mailCheck = yield userRepo.findOneBy({
                    email: request.email
                });
                if (mailCheck == null) {
                    const user = yield userRepo.findOneBy({
                        id: res.locals.user_id
                    });
                    user.email = request.email;
                    yield userRepo.save(user);
                    return res.status(200).end('mail_change_success');
                }
                else {
                    return res.status(400).end('mail_already_inUse');
                }
            }
            if (verified) {
                return res.status(200).end('mail_verified_success');
            }
            res.status(400).end();
        });
    }
    PutUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const errors = [];
            if (req.body.firstname != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.firstname, 'firstname', res.locals.user_id)))
                    errors.push('validation_failed_firstname');
            if (req.body.lastname != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.lastname, 'lastname', res.locals.user_id)))
                    errors.push('validation_failed_firstname');
            if (req.body.birthday != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.birthday, 'birthday', res.locals.user_id)))
                    errors.push('validation_failed_firstname');
            if (req.body.phone != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.phone, 'phone', res.locals.user_id)))
                    errors.push('validation_failed_firstname');
            if (req.body.street != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.street, 'street', res.locals.user_id)))
                    errors.push('validation_failed_firstname');
            if (req.body.houseNr != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.houseNr, 'houseNr', res.locals.user_id)))
                    errors.push('validation_failed_firstname');
            if (req.body.zip != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.zip, 'zip', res.locals.user_id)))
                    errors.push('validation_failed_firstname');
            if (req.body.city != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.city, 'city', res.locals.user_id)))
                    errors.push('validation_failed_firstname');
            if (req.body.county != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.county, 'country', res.locals.user_id)))
                    errors.push('validation_failed_firstname');
            if (req.body.nationality != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.nationality, 'nationality', res.locals.user_id)))
                    errors.push('validation_failed_firstname');
            if (errors.length > 0) {
                res.status(400).send(errors);
            }
            else {
                res.status(200).end();
            }
        });
    }
    PutUsername(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            if (req.body.username == null) {
                return res.status(400).send({
                    reason: 'username_required'
                });
            }
            if (!validator_1.default.isAlpha(req.body.username.toString())) {
                return res.status(400).send({
                    reason: 'username_validation_failed'
                });
            }
            if ((yield userRepo.countBy({ username: req.body.username })) > 0) {
                return res.status(400).send({
                    reason: 'username_already_inUse'
                });
            }
            const user = yield userRepo.findOneBy({
                id: res.locals.user_id
            });
            user.username = req.body.username;
            yield userRepo.save(user);
            res.status(200).end();
        });
    }
    PutManageUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'users', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            if (req.body.user_id == null || !validator_1.default.isNumeric(req.body.user_id.toString())) {
                return res.status(403).send({
                    reason: 'userId_not_provided'
                });
            }
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepo.findOneBy({
                id: req.body.user_id
            });
            const errors = [];
            if (req.body.firstname != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.firstname, 'firstname', user.id)))
                    errors.push('validation_failed_firstname');
            if (req.body.lastname != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.lastname, 'lastname', user.id)))
                    errors.push('validation_failed_lastname');
            if (req.body.birthday != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.birthday, 'birthday', user.id)))
                    errors.push('validation_failed_birthday');
            if (req.body.phone != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.phone, 'phone', user.id)))
                    errors.push('validation_failed_phone');
            if (req.body.street != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.street, 'street', user.id)))
                    errors.push('validation_failed_street');
            if (req.body.houseNr != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.houseNr, 'houseNr', user.id)))
                    errors.push('validation_failed_houseNr');
            if (req.body.zip != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.zip, 'zip', user.id)))
                    errors.push('validation_failed_zip');
            if (req.body.city != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.city, 'city', user.id)))
                    errors.push('validation_failed_city');
            if (req.body.county != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.county, 'country', user.id)))
                    errors.push('validation_failed_country');
            if (req.body.nationality != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.nationality, 'nationality', user.id)))
                    errors.push('validation_failed_nationality');
            if (req.body.username != null && !(yield UserService_1.UserService.usernameAlreadyExists(req.body.username)))
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.username, 'username', user.id)))
                    errors.push('validation_failed_username');
            if (req.body.email != null && !(yield UserService_1.UserService.mailAlreadyExists(req.body.email)))
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.email, 'email', user.id)))
                    errors.push('validation_failed_email');
            if (req.body.isActive != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.isActive, 'isActive', user.id)))
                    errors.push('validation_failed_isActive');
            if (req.body.otpActive != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.otpActive, 'otpActive', user.id)))
                    errors.push('validation_failed_otpActive');
            if (req.body.verified != null)
                if (!(yield UserService_1.UserService.checkAndChangeData(req.body.verified, 'verified', user.id)))
                    errors.push('validation_failed_verified');
            if (errors.length > 0) {
                res.status(400).send(errors);
            }
            else {
                res.status(200).end();
            }
        });
    }
    GetPermissions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const permissionRepo = DatabaseProvider_1.AppDataSource.getRepository(Permission_1.Permission);
            const user = yield userRepo.findOneBy({
                id: res.locals.user_id
            });
            const permissionAssignmentsUser = yield UserService_1.UserService.getPermissionAssignmentsByUser(user);
            for (const item of permissionAssignmentsUser) {
                item.permission = yield permissionRepo.findOneBy({ id: item.permission_id });
                delete item.createdAt;
                delete item.updatedAt;
                delete item.user_id;
                delete item.group_id;
                delete item.permission_id;
            }
            return res.status(200).send(permissionAssignmentsUser);
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=UserController.js.map