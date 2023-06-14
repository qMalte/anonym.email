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
exports.AuthService = void 0;
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const Session_1 = require("../models/Session");
const StringHelper_1 = require("../../helpers/StringHelper");
const DateHelper_1 = require("../../helpers/DateHelper");
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
const PasswordResetLink_1 = require("../models/PasswordResetLink");
const NumericHelper_1 = require("../../helpers/NumericHelper");
const MailService_1 = require("./MailService");
const FailedLogin_1 = require("../models/FailedLogin");
const BlacklistedIP_1 = require("../models/BlacklistedIP");
const typeorm_1 = require("typeorm");
const UserService_1 = require("./UserService");
class AuthService {
    login(password, ip, username = null, email = null, pubKey = null) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ip.includes("::ffff:")) {
                ip = ip.replace('::ffff:', '');
            }
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            if ((username == null && email == null) || password == null || (username != null && email != null)) {
                // Username and E-Mail given, password is empty or username and password is empty
                return null;
            }
            let user = null;
            if (username != null) {
                user = yield userRepo.findOneBy({
                    username: username.toLowerCase()
                });
            }
            else if (email != null) {
                user = yield userRepo.findOneBy({
                    email: email.toLowerCase()
                });
            }
            if (user == null) {
                yield this.setFailedLogin(ip);
                return null;
            }
            if ((yield bcrypt_1.default.compare(password, user.password)) && ip != null) {
                return yield this.createSession(user, ip, pubKey);
            }
            else {
                yield this.setFailedLogin(ip, user);
                return null;
            }
        });
    }
    createSession(user, ip, pubKey) {
        return __awaiter(this, void 0, void 0, function* () {
            if (ip.includes("::ffff:")) {
                ip = ip.replace('::ffff:', '');
            }
            const sessionRepo = DatabaseProvider_1.AppDataSource.getRepository(Session_1.Session);
            const session = new Session_1.Session();
            session.user_id = user.id;
            session.ip = ip;
            session.secretDecrypted = StringHelper_1.StringHelper.Generate(128);
            session.prefix = session.secretDecrypted.substring(0, 16);
            session.secret = yield bcrypt_1.default.hash(session.secretDecrypted, 10);
            session.expired_at = DateHelper_1.DateHelper.addMinutes(60);
            if (pubKey != null) {
                session.pubKey = pubKey;
            }
            return yield sessionRepo.save(session);
        });
    }
    passwordReset(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const resetLinkRepo = DatabaseProvider_1.AppDataSource.getRepository(PasswordResetLink_1.PasswordResetLink);
            const currentLinks = yield resetLinkRepo.findBy({
                user_id: user.id
            });
            for (const passwordResetLink of currentLinks) {
                if (passwordResetLink.expired_at > new Date()) {
                    passwordResetLink.expired_at = new Date();
                    yield resetLinkRepo.save(passwordResetLink);
                }
            }
            const link = new PasswordResetLink_1.PasswordResetLink();
            link.user_id = user.id;
            link.expired_at = DateHelper_1.DateHelper.addMinutes(5);
            link.code = NumericHelper_1.NumericHelper.Generate(6);
            while ((yield resetLinkRepo.countBy({
                code: link.code
            })) > 0) {
                link.code = NumericHelper_1.NumericHelper.Generate(6);
            }
            yield resetLinkRepo.save(link);
            const message = `Hallo ${user.email},\n\n
mit dieser E-Mail senden wir dir deinen Sicherheitscode zu, mit welchem du dein Passwort auf unserer Webseite zurücksetzen kannst.\n
Solltest du das zurücksetzen deines Passwortes nicht beantragt haben, ignoriere bitte diese Nachricht!\n
\n
Dein Sicherheitscode: ${link.code}`;
            const mail = new MailService_1.MailService(user.email, 'Zurücksetzung des Passworts', message, MailService_1.Template.PASSWORD_RESET_REQ, [link.code.toString()]);
            return yield mail.send();
        });
    }
    setPassword(email, securityCode, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const resetLinkRepo = DatabaseProvider_1.AppDataSource.getRepository(PasswordResetLink_1.PasswordResetLink);
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const passwordResetLink = yield resetLinkRepo.findOneBy({
                code: securityCode
            });
            const user = yield userRepo.findOneBy({
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
            yield resetLinkRepo.save(passwordResetLink);
            user.password = yield bcrypt_1.default.hash(password, 10);
            yield userRepo.save(user);
            const message = `Hallo ${user.email},\n\n
mit dieser E-Mail bestätigen wir die Änderung deines Passworts!\n
Solltest du keine Änderung deines Passwortes durchgeführt haben, kontaktiere uns schnellstmöglich!\n
Wir werden dann eine umgehende Sperrung deines Account einleiten.`;
            const mail = new MailService_1.MailService(user.email, 'Passwort Änderung', message, MailService_1.Template.PASSWORD_RESET_SUCCESS);
            return yield mail.send();
        });
    }
    setFailedLogin(ip, user = null) {
        return __awaiter(this, void 0, void 0, function* () {
            const failedLoginRepo = DatabaseProvider_1.AppDataSource.getRepository(FailedLogin_1.FailedLogin);
            let failedLogin = yield failedLoginRepo.findOneBy({
                ip,
                created_at: (0, typeorm_1.MoreThan)(DateHelper_1.DateHelper.removeMinutes(4))
            });
            if (failedLogin != null) {
                failedLogin.counter++;
            }
            else {
                failedLogin = new FailedLogin_1.FailedLogin();
                failedLogin.ip = ip;
                failedLogin.created_at = new Date();
                failedLogin.counter = 1;
            }
            if (user != null) {
                failedLogin.user_id = user.id;
            }
            yield failedLoginRepo.save(failedLogin);
            if (failedLogin.counter >= 10) {
                const blacklistedIPRepo = DatabaseProvider_1.AppDataSource.getRepository(BlacklistedIP_1.BlacklistedIP);
                const ipStatus = yield this.isIPBlocked(ip);
                if (ipStatus === false) {
                    const ipBlock = new BlacklistedIP_1.BlacklistedIP();
                    ipBlock.ip = ip;
                    ipBlock.expired_at = DateHelper_1.DateHelper.addMinutes(10);
                    ipBlock.created_at = new Date();
                    yield blacklistedIPRepo.save(ipBlock);
                }
                else {
                    const ipEntry = yield blacklistedIPRepo.findOneBy({
                        id: +ipStatus
                    });
                    ipEntry.expired_at = DateHelper_1.DateHelper.addMinutes(10);
                    yield blacklistedIPRepo.save(ipEntry);
                }
            }
        });
    }
    isIPBlocked(ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const ipRepo = DatabaseProvider_1.AppDataSource.getRepository(BlacklistedIP_1.BlacklistedIP);
            const ips = yield ipRepo.findBy({
                ip
            });
            for (const ipEntry of ips) {
                if (ipEntry.expired_at > new Date()) {
                    return ipEntry.id;
                }
            }
            return false;
        });
    }
    register(username, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const user = new User_1.User();
            user.username = username;
            user.email = email;
            user.password = yield bcrypt_1.default.hash(password, 10);
            user.verifyCode = NumericHelper_1.NumericHelper.Generate(6);
            try {
                yield UserService_1.UserService.sendVerificationMail(user);
                yield userRepo.save(user);
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    registerConfirm(username, email, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            try {
                const user = yield userRepo.findOneBy({
                    username, email, verifyCode: token
                });
                if (user != null && !user.verified) {
                    user.verified = true;
                    yield userRepo.save(user);
                    return 200;
                }
                else {
                    return 400;
                }
            }
            catch (e) {
                return 500;
            }
        });
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map