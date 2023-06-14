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
exports.Template = exports.MailService = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class MailService {
    constructor(target, subject, message, html, params = []) {
        this.target = target;
        this.subject = subject;
        this.message = message;
        this.html = html;
        this.params = params;
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
            const templateFile = fs_1.default.readFileSync(`${__dirname}/../../../storage/mails/${this.html}`, 'utf8');
            let i = 1;
            this.params.forEach((param) => {
                console.log(param);
                templateFile.replace(`{param${i}}`, param);
                i++;
            });
            const message = {
                from: `${this.fromName} <${this.fromAddress}>`,
                to: this.target,
                subject: this.subject,
                text: this.message,
                html: templateFile
            };
            if (message == null) {
                return false;
            }
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
var Template;
(function (Template) {
    Template["PASSWORD_RESET_REQ"] = "password-reset-req.html";
    Template["PASSWORD_RESET_SUCCESS"] = "password-reset-confirmation.html";
})(Template = exports.Template || (exports.Template = {}));
//# sourceMappingURL=MailService.js.map