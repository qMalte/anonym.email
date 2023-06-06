"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onAuth = void 0;
const LoggingHelper_1 = require("../../../../helpers/LoggingHelper");
const onAuth = (auth, session, callback) => {
    const log = new LoggingHelper_1.LoggingHelper(__dirname);
    log.info('[SMTP] onAuth');
    return callback();
};
exports.onAuth = onAuth;
//# sourceMappingURL=onAuth.smtp.js.map