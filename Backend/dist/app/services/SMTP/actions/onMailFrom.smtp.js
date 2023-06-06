"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onMailFrom = void 0;
const LoggingHelper_1 = require("../../../../helpers/LoggingHelper");
const onMailFrom = (address, session, callback) => {
    const log = new LoggingHelper_1.LoggingHelper(__dirname);
    log.info('[SMTP] onMailFrom');
    return callback(); // Accept the address
};
exports.onMailFrom = onMailFrom;
//# sourceMappingURL=onMailFrom.smtp.js.map