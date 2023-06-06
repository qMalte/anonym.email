"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onConnect = void 0;
const LoggingHelper_1 = require("../../../../helpers/LoggingHelper");
const onConnect = (session, callback) => {
    const log = new LoggingHelper_1.LoggingHelper(__dirname);
    log.info('[SMTP] onConnect');
    log.info('[SMTP] remoteAddress: ' + session.remoteAddress);
    log.info('[SMTP] clientHostname: ' + session.clientHostname);
    return callback(); // Accept the connection
};
exports.onConnect = onConnect;
//# sourceMappingURL=onConnect.smtp.js.map