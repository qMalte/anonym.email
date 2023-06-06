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
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
const BlacklistedIP_1 = require("../models/BlacklistedIP");
exports.default = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const ipRepo = DatabaseProvider_1.AppDataSource.getRepository(BlacklistedIP_1.BlacklistedIP);
    let ip = req.ip;
    if (req.ip.includes("::ffff:")) {
        ip = req.ip.replace('::ffff:', '');
    }
    const ips = yield ipRepo.findBy({
        ip
    });
    for (const ipEntry of ips) {
        if (ipEntry.expired_at > new Date()) {
            return res.status(403).send({
                reason: 'ip_blacklisted'
            });
        }
    }
    next();
});
//# sourceMappingURL=SpamProtMiddleware.js.map