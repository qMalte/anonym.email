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
exports.onData = void 0;
const LoggingHelper_1 = require("../../../../helpers/LoggingHelper");
const mailparser_1 = __importDefault(require("mailparser"));
const spf_protection_1 = require("../middlewares/spf.protection");
const onData = (stream, session, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const log = new LoggingHelper_1.LoggingHelper(__dirname);
    const remoteAddress = session.remoteAddress;
    const clientHostname = session.clientHostname;
    try {
        const parsed = yield mailparser_1.default.simpleParser(stream);
        if (Array.isArray(parsed.to)) {
            parsed.to.forEach(item => {
                item.value.forEach(x => {
                    log.info('[SMTP] Nach: ' + x.address);
                });
            });
        }
        else {
            parsed.to.value.forEach(item => {
                log.info('[SMTP] Nach: ' + item.address);
            });
        }
        for (const item of parsed.from.value) {
            if (!(yield spf_protection_1.SpfProtection(item.address, remoteAddress))) {
                return callback(new Error('Permission Denied - Your Server are not permit to send Messages by this MailAlias.'));
            }
            log.info('[SMTP] Von: ' + item.address);
        }
        log.info('[SMTP] Betreff: ' + parsed.subject);
        log.info('[SMTP] Datum: ' + parsed.date);
        log.info('[SMTP] Text: ' + parsed.text);
        return callback();
    }
    catch (e) {
        return callback(new Error('Service currently unavailable - Please try again later.'));
    }
});
exports.onData = onData;
//# sourceMappingURL=onData.smtp.js.map
