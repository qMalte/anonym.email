"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DNSService = void 0;
const dns_1 = __importDefault(require("dns"));
class DNSService {
    static checkTxtRecord(name, value) {
        return new Promise(resolve => {
            dns_1.default.setServers(['1.1.1.1', '1.0.0.1']);
            dns_1.default.resolveTxt(name, (err, records) => {
                if (err) {
                    resolve(false);
                    return;
                }
                else {
                    if (records != null && records.length != null && records.length === 1
                        && records[0] != null && records[0].length != null && records[0].length === 1) {
                        if (records[0][0] === value) {
                            resolve(true);
                            return;
                        }
                    }
                    resolve(false);
                }
            });
        });
    }
    static checkMxRecord(name, expectedExchange) {
        return new Promise(resolve => {
            dns_1.default.setServers(['1.1.1.1', '1.0.0.1']);
            dns_1.default.resolveMx(name, (err, records) => {
                if (err) {
                    resolve(false);
                    return;
                }
                else {
                    let prioOfExcepted = -1;
                    for (const record of records) {
                        if (record.exchange === expectedExchange) {
                            prioOfExcepted = record.priority;
                        }
                    }
                    for (const record of records) {
                        if (record.exchange !== expectedExchange) {
                            if (record.priority > prioOfExcepted) {
                                resolve(false);
                                return;
                            }
                        }
                    }
                    if (prioOfExcepted === -1) {
                        resolve(false);
                        return;
                    }
                    resolve(true);
                }
            });
        });
    }
}
exports.DNSService = DNSService;
//# sourceMappingURL=DNSService.js.map