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
exports.SpfProtection = void 0;
// @ts-ignore
const spf_check_1 = __importDefault(require("spf-check"));
const SpfProtection = (fromMail, remoteIp) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise(resolve => {
        const domainArr = fromMail.split('@');
        if (domainArr.length < 2) {
            return false;
        }
        const domain = domainArr[1];
        const validator = new spf_check_1.default.SPF(domain, fromMail);
        validator.check(remoteIp).then((result) => {
            if (result instanceof spf_check_1.default.SPFResult) {
                if (result.result == spf_check_1.default.Pass || result.result == spf_check_1.default.Neutral) {
                    resolve(true);
                }
            }
            resolve(false);
        });
    });
});
exports.SpfProtection = SpfProtection;
//# sourceMappingURL=spf.protection.js.map