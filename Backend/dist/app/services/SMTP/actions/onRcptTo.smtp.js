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
exports.onRcptTo = void 0;
const LoggingHelper_1 = require("../../../../helpers/LoggingHelper");
const EntityRegistry_1 = require("../../../../database/EntityRegistry");
const onRcptTo = (address, session, callback) => __awaiter(void 0, void 0, void 0, function* () {
    const log = new LoggingHelper_1.LoggingHelper(__dirname);
    if (address == null || address.address == null) {
        return callback(new Error('Bad Request - No unique Receipt Address'));
    }
    const mail = address.address;
    const mailArr = mail.split('@');
    if (mailArr.length != 2) {
        return callback(new Error('Bad Request - No valid Receipt Address'));
    }
    const domain = yield EntityRegistry_1.EntityRegistry.getInstance().Domain.findOneBy({ name: mailArr[1] });
    if (domain == null) {
        return callback(new Error('Bad Request - This MailAlias do not manged by this Server.'));
    }
    const mailbox = yield EntityRegistry_1.EntityRegistry.getInstance().Mailbox.findOne({
        relations: {
            domain: true
        },
        where: {
            name: mailArr[0]
        }
    });
    if (mailbox == null || mailbox.domain.id != domain.id) {
        return callback(new Error('Bad Request - This Receipt-Mailbox do not manged by this Server.'));
    }
    return callback(); // Accept the address
});
exports.onRcptTo = onRcptTo;
//# sourceMappingURL=onRcptTo.smtp.js.map
