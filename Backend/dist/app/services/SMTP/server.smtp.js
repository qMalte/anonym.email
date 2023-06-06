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
exports.SmtpServer = void 0;
const smtp_server_1 = require("smtp-server");
const onAuth_smtp_1 = require("./actions/onAuth.smtp");
const onClose_smtp_1 = require("./actions/onClose.smtp");
const onConnect_smtp_1 = require("./actions/onConnect.smtp");
const onData_smtp_1 = require("./actions/onData.smtp");
const onMailFrom_smtp_1 = require("./actions/onMailFrom.smtp");
const onRcptTo_smtp_1 = require("./actions/onRcptTo.smtp");
class SmtpServer {
    constructor() {
        this.hostname = 'backend.stepone.gg';
        this.options = {
            secure: false,
            name: this.hostname,
            authOptional: true,
            authMethods: ['PLAIN', 'LOGIN', 'XOAUTH2'],
            banner: `ESMTP - StepOne (${this.hostname})`,
            size: 104857600,
            maxClients: 50,
            onAuth: onAuth_smtp_1.onAuth,
            onClose: onClose_smtp_1.onClose,
            onConnect: onConnect_smtp_1.onConnect,
            onData: onData_smtp_1.onData,
            onMailFrom: onMailFrom_smtp_1.onMailFrom,
            onRcptTo: onRcptTo_smtp_1.onRcptTo,
        };
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.server = new smtp_server_1.SMTPServer(this.options);
            this.server.listen(25);
        });
    }
    static get Instance() {
        if (this._Instance == null)
            this._Instance = new SmtpServer();
        return this._Instance;
    }
}
exports.SmtpServer = SmtpServer;
//# sourceMappingURL=server.smtp.js.map