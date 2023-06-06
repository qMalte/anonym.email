"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const LoggingHelper_1 = require("../../helpers/LoggingHelper");
exports.default = (req, res, next) => {
    const log = new LoggingHelper_1.LoggingHelper(__dirname);
    let ip = req.ip;
    if (req.ip.includes("::ffff:")) {
        ip = req.ip.replace('::ffff:', '');
    }
    log.info(req.method + " - " + req.url);
    next();
};
//# sourceMappingURL=LogUrlMiddleware.js.map