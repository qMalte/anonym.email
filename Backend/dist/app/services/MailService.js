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
exports.MailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv").config();
class MailService {
    constructor(target, subject, message) {
        this.target = target;
        this.subject = subject;
        this.message = message;
        this.fromAddress = process.env.SMTP_FROM_ADDRESS;
        this.fromName = process.env.SMTP_FROM_NAME;
        this.transport = nodemailer_1.default.createTransport({
            host: process.env.SMTP_HOSTNAME,
            port: +process.env.SMTP_PORT,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            }
        });
        //
    }
    send() {
        return __awaiter(this, void 0, void 0, function* () {
            const message = {
                from: `${this.fromName} <${this.fromAddress}>`,
                to: this.target,
                subject: this.subject,
                text: this.message
            };
            try {
                yield this.transport.sendMail(message);
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
}
exports.MailService = MailService;
//# sourceMappingURL=MailService.js.map