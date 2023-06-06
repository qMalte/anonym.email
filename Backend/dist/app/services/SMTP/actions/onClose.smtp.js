"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.onClose = void 0;
const LoggingHelper_1 = require("../../../../helpers/LoggingHelper");
const onClose = () => {
    const log = new LoggingHelper_1.LoggingHelper(__dirname);
    log.info('[SMTP] Close Connection');
};
exports.onClose = onClose;
//# sourceMappingURL=onClose.smtp.js.map