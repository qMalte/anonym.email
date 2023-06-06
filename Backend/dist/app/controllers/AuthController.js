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
exports.AuthController = void 0;
const validator_1 = __importDefault(require("validator"));
const Session_1 = require("../models/Session");
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
const User_1 = require("../models/User");
const otplib_1 = require("otplib");
const DateHelper_1 = require("../../helpers/DateHelper");
const RSAService_1 = require("../services/RSAService");
const UserService_1 = require("../services/UserService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const ServiceRegistry_1 = require("../services/ServiceRegistry");
const ValidationResources_1 = require("../../resources/ValidationResources");
const AuthenticationResources_1 = require("../../resources/AuthenticationResources");
const SystemResources_1 = require("../../resources/SystemResources");
class AuthController {
    PostLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
                if (req.body.login == null) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.EmptyLogin);
                }
                if (req.body.password == null) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.EmptyPassword);
                }
                let login;
                let password;
                let pubKey = null;
                const regex = new RegExp('-*BEGIN PUBLIC KEY-*\\r?\\n?[A-Za-z0-9\\/\\r?\\n?+=]*-*END PUBLIC KEY-*\\r?\\n?');
                if (req.body.pubKey != null && regex.test(req.body.pubKey)) {
                    pubKey = req.body.pubKey;
                }
                if (req.body.ec != null && req.body.ec) {
                    login = RSAService_1.RSAService.decrypt(req.body.login);
                    password = RSAService_1.RSAService.decrypt(req.body.password);
                }
                else {
                    login = req.body.login;
                    password = req.body.password;
                }
                let session;
                if (login != null && login.includes('@') && validator_1.default.isEmail(login)) {
                    session = yield ServiceRegistry_1.ServiceRegistry.Auth.login(password, req.ip, null, login, pubKey);
                }
                else {
                    session = yield ServiceRegistry_1.ServiceRegistry.Auth.login(password, req.ip, login, null, pubKey);
                }
                if (session != null) {
                    const user = yield userRepo.findOneBy({
                        id: session.user_id
                    });
                    res.status(200).send({
                        ec: pubKey != null,
                        otpActive: user.otpActive,
                        isVerified: session.isVerified,
                        secret: pubKey != null ? RSAService_1.RSAService.encrypt(session.secretDecrypted, pubKey) : session.secretDecrypted,
                        expire_at: session.expired_at
                    });
                }
                else {
                    res.status(401).send(AuthenticationResources_1.AuthenticationResources.BadCredentials);
                }
            }
            catch (e) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
        });
    }
    PostLogout(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sessionRepo = DatabaseProvider_1.AppDataSource.getRepository(Session_1.Session);
                const session = yield sessionRepo.findOneBy({
                    prefix: req.header("Authorization").substring(0, 16)
                });
                if (session == null) {
                    return res.status(500).end();
                }
                session.expired_at = new Date();
                yield sessionRepo.save(session);
                res.status(200).end();
            }
            catch (e) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
        });
    }
    PostOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const sessionRepo = DatabaseProvider_1.AppDataSource.getRepository(Session_1.Session);
            if (res.locals.user_id == null) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
            if (req.body.token == null) {
                return res.status(400).send(ValidationResources_1.ValidationResources.MissingOtpToken);
            }
            const user = yield userRepo.findOneBy({
                id: res.locals.user_id
            });
            const isValid = otplib_1.authenticator.check(req.body.token, user.otpSecret);
            if (isValid) {
                const session = yield sessionRepo.findOneBy({
                    prefix: req.header("Authorization").substring(0, 16)
                });
                session.isVerified = true;
                session.expired_at = DateHelper_1.DateHelper.addMinutes(10);
                yield sessionRepo.save(session);
                return res.status(200).end();
            }
            else {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.BadOtp);
            }
        });
    }
    PostResetPasswordRequest(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            if (req.body.email == null) {
                return res.status(400).send(ValidationResources_1.ValidationResources.MissingMailToResetPassword);
            }
            const user = yield userRepo.findOneBy({
                email: req.body.email
            });
            if (user == null) {
                return res.status(400).send({
                    reason: 'Could not find User with given E-Mail Address!'
                });
            }
            if (yield ServiceRegistry_1.ServiceRegistry.Auth.passwordReset(user)) {
                return res.status(200).end();
            }
            res.status(500).send(SystemResources_1.SystemResources.ServerError);
        });
    }
    PostPasswordReset(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.email == null || req.body.code == null || req.body.password == null) {
                return res.status(400).send(ValidationResources_1.ValidationResources.MissingDataPasswordReset);
            }
            if (!validator_1.default.isEmail(req.body.email)) {
                return res.status(400).send(ValidationResources_1.ValidationResources.MailFormat);
            }
            if (!validator_1.default.isNumeric(req.body.code.toString())) {
                return res.status(400).send(ValidationResources_1.ValidationResources.SecurityCode);
            }
            if (yield ServiceRegistry_1.ServiceRegistry.Auth.setPassword(req.body.email, req.body.code, req.body.password)) {
                res.status(200).end();
            }
            else {
                res.status(403).send(AuthenticationResources_1.AuthenticationResources.FailedPasswordReset);
            }
        });
    }
    PostRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Disable Registration
            return res.status(400).send(AuthenticationResources_1.AuthenticationResources.RegistrationDisabled);
            if (req.body.email == null || req.body.username == null || req.body.password == null) {
                return res.status(400).send(ValidationResources_1.ValidationResources.RegisterData);
            }
            if (!validator_1.default.isEmail(req.body.email.toString())) {
                return res.status(400).send(ValidationResources_1.ValidationResources.MailFormat);
            }
            if (!validator_1.default.isAlpha(req.body.username.toString())) {
                return res.status(400).send(ValidationResources_1.ValidationResources.UsernameFormat);
            }
            if (yield UserService_1.UserService.mailAlreadyExists(req.body.email)) {
                return res.status(400).send(ValidationResources_1.ValidationResources.MultipleMailFormat);
            }
            if (yield UserService_1.UserService.usernameAlreadyExists(req.body.username)) {
                return res.status(400).send(ValidationResources_1.ValidationResources.MultipleUsernameFormat);
            }
            let username = null;
            let password = null;
            let email = null;
            if (req.body.ec != null && req.body.ec) {
                username = RSAService_1.RSAService.decrypt(req.body.username);
                password = RSAService_1.RSAService.decrypt(req.body.password);
                email = RSAService_1.RSAService.decrypt(req.body.email);
            }
            else {
                username = req.body.username;
                password = req.body.password;
                email = req.body.email;
            }
            if (yield ServiceRegistry_1.ServiceRegistry.Auth.register(username, email, password)) {
                return res.status(200).end();
            }
            else {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
        });
    }
    PostRegisterConfirm(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // Disable Registration
            return res.status(400).send(AuthenticationResources_1.AuthenticationResources.RegistrationDisabled);
            if (req.body.email == null || req.body.username == null || req.body.token == null) {
                return res.status(400).send(ValidationResources_1.ValidationResources.RegisterData);
            }
            if (!validator_1.default.isNumeric(req.body.token.toString())) {
                return res.status(400).send(ValidationResources_1.ValidationResources.SecurityCode);
            }
            let username = null;
            let token = null;
            let email = null;
            if (req.body.ec != null && req.body.ec) {
                username = RSAService_1.RSAService.decrypt(req.body.username);
                token = RSAService_1.RSAService.decrypt(req.body.token);
                email = RSAService_1.RSAService.decrypt(req.body.email);
            }
            else {
                username = req.body.username;
                token = req.body.token;
                email = req.body.email;
            }
            const state = yield ServiceRegistry_1.ServiceRegistry.Auth.registerConfirm(username, email, token);
            return res.status(state).end();
        });
    }
    PostEnableOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.otpCode == null || req.body.password == null) {
                return res.status(400).send(ValidationResources_1.ValidationResources.OtpEnableParams);
            }
            if (!validator_1.default.isNumeric(req.body.otpCode.toString())) {
                return res.status(400).send(ValidationResources_1.ValidationResources.OtpCodeFormat);
            }
            let otpCode = null;
            let password = null;
            if (req.body.ec != null && req.body.ec) {
                otpCode = RSAService_1.RSAService.decrypt(req.body.otpCode);
                password = RSAService_1.RSAService.decrypt(req.body.password);
            }
            else {
                otpCode = req.body.otpCode;
                password = req.body.password;
            }
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const sessionRepo = DatabaseProvider_1.AppDataSource.getRepository(Session_1.Session);
            const user = yield userRepo.findOneBy({ id: res.locals.user_id });
            if (!(yield bcrypt_1.default.compare(password, user.password))) {
                return res.status(400).send(AuthenticationResources_1.AuthenticationResources.BadCredentials);
            }
            const isValid = otplib_1.authenticator.check(otpCode, user.otpSecret);
            if (isValid) {
                const session = res.locals.session;
                session.isVerified = true;
                user.otpActive = true;
                yield userRepo.save(user);
                yield sessionRepo.save(session);
                return res.status(200).end();
            }
            else {
                return res.status(400).send(AuthenticationResources_1.AuthenticationResources.BadOtp);
            }
        });
    }
    PostDisableOTP(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
                password = RSAService_1.RSAService.decrypt(req.body.password);
            }
            else {
                password = req.body.password;
            }
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepo.findOneBy({ id: res.locals.user_id });
            if (yield bcrypt_1.default.compare(password, user.password)) {
                user.otpActive = false;
                yield userRepo.save(user);
                return res.status(200).end();
            }
            else {
                return res.status(400).send({
                    reason: 'password_validation_failed'
                });
            }
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map