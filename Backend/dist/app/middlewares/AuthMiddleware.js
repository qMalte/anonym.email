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
const DateHelper_1 = require("../../helpers/DateHelper");
const bcrypt_1 = __importDefault(require("bcrypt"));
const EntityRegistry_1 = require("../../database/EntityRegistry");
const LoggingHelper_1 = require("../../helpers/LoggingHelper");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const log = new LoggingHelper_1.LoggingHelper(__dirname);
    const authorizationToken = req.header("Authorization");
    let ip = req.ip;
    if (req.ip.includes("::ffff:")) {
        ip = req.ip.replace('::ffff:', '');
    }
    if (authorizationToken != null && authorizationToken !== "") {
        const session = yield EntityRegistry_1.EntityRegistry.getInstance().Session.findOneBy({
            prefix: authorizationToken.substring(0, 16)
        });
        if (session != null && (yield bcrypt_1.default.compare(authorizationToken, session.secret))) {
            if (session.expired_at >= new Date()) {
                log.debug(`Authentifizierungs-Versuch - Match IP: ${session.ip} -> ${ip}`);
                if (session.ip === ip) {
                    // One Factor (Username and Password AuthenticationResources)
                    const user = yield EntityRegistry_1.EntityRegistry.getInstance().User.findOneBy({
                        id: session.user_id
                    });
                    res.locals.user_id = session.user_id;
                    if (user.otpActive && !session.isVerified) {
                        return res.status(403).send({
                            reason: "otp_required"
                        });
                    }
                    if (!user.isActive) {
                        return res.status(403).send({
                            reason: 'account_deactivated'
                        });
                    }
                    session.expired_at = DateHelper_1.DateHelper.addMinutes(60);
                    res.locals.session = session;
                    yield session.save();
                    next();
                    return;
                }
                else {
                    session.expired_at = new Date();
                    yield session.save();
                    return res.status(401).send({
                        reason: "ip_validation_failed"
                    });
                }
            }
            else {
                return res.status(401).send({
                    reason: "session_expired"
                });
            }
        }
        else {
            return res.status(401).send({
                reason: "authorization_token_mismatch"
            });
        }
    }
    else {
        return res.status(400).send({
            reason: "authorization_header_empty"
        });
    }
});
//# sourceMappingURL=AuthMiddleware.js.map