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
Object.defineProperty(exports, "__esModule", { value: true });
const AuthenticationResources_1 = require("../../resources/AuthenticationResources");
const RSAService_1 = require("../services/RSAService");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (process.env.CLOSED_BETA.toLowerCase() === "true") {
        const betaKeyEncrypted = req.header("X-Beta-Token");
        if (betaKeyEncrypted == null) {
            return res.status(400).send(AuthenticationResources_1.AuthenticationResources.EmptyBetaToken);
        }
        const betaKeyDecrypted = RSAService_1.RSAService.decrypt(betaKeyEncrypted);
        if (betaKeyDecrypted !== process.env.CLOSED_BETA_CODE) {
            return res.status(401).send(AuthenticationResources_1.AuthenticationResources.IncorrectBetaToken);
        }
    }
    next();
});
//# sourceMappingURL=BetaMiddleware.js.map