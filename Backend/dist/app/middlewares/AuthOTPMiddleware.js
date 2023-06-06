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
const Session_1 = require("../models/Session");
const User_1 = require("../models/User");
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const sessionRepo = DatabaseProvider_1.AppDataSource.getRepository(Session_1.Session);
    const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
    const authorizationToken = req.header("Authorization");
    let ip = req.ip;
    if (req.ip.includes("::ffff:")) {
        ip = req.ip.replace('::ffff:', '');
    }
    if (authorizationToken != null && authorizationToken != "") {
        const session = yield sessionRepo.findOneBy({
            prefix: authorizationToken.substring(0, 16)
        });
        if (session != null && (yield bcrypt_1.default.compare(authorizationToken, session.secret))) {
            if (session.expired_at >= new Date()) {
                if (session.ip == ip) {
                    // One Factor (Username and Password AuthenticationResources)
                    const user = yield userRepo.findOneBy({
                        id: session.user_id
                    });
                    if (user.otpActive && !session.isVerified) {
                        res.locals.user_id = session.user_id;
                        next();
                        return;
                    }
                    else if (user.otpActive && session.isVerified) {
                        return res.status(400).send({
                            reason: 'Already Authenticated!'
                        });
                    }
                    else {
                        return res.status(400).send({
                            reason: 'OTP-AuthenticationResources is not be enabled!'
                        });
                    }
                }
                else {
                    yield sessionRepo
                        .createQueryBuilder()
                        .update({
                        expired_at: new Date()
                    })
                        .where({
                        id: session.id
                    })
                        .execute();
                    return res.status(401).send({
                        reason: "The saved IP-Address don't match with the Request Header"
                    });
                }
            }
            else {
                return res.status(401).send({
                    reason: "The Session is expired!"
                });
            }
        }
        else {
            return res.status(401).send({
                reason: "The given Authorization-Token don't match with a saved Session!"
            });
        }
    }
    else {
        return res.status(400).send({
            reason: "The Request don't include a required Authorization Header!"
        });
    }
});
//# sourceMappingURL=AuthOTPMiddleware.js.map