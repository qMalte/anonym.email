"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With, X-Beta-Token');
    if (req.method === "OPTIONS") {
        res.status(200).end();
        return;
    }
    next();
};
//# sourceMappingURL=CorsMiddleware.js.map