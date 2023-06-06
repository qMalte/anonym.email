"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.ProxmoxService = void 0;
const superagent_1 = __importDefault(require("superagent"));
const dotenv_1 = __importDefault(require("dotenv"));
const Domain_1 = require("../models/Proxmox/Domain");
const Transport_1 = require("../models/Proxmox/Transport");
const process = __importStar(require("process"));
dotenv_1.default.config();
class ProxmoxService {
    static createTicket() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const req = yield superagent_1.default
                    .post(`${this.host}/api2/json/access/ticket`)
                    .disableTLSCerts()
                    .send({
                    username: process.env.PROXMOX_USER,
                    password: process.env.PROXMOX_PASS
                })
                    .timeout(6000);
                if (req.status === 200) {
                    this.ticket = req.body.data.ticket;
                    this.csrf = req.body.data.CSRFPreventionToken;
                    return true;
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
    }
    static getDomains(retry = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ticket == null) {
                yield this.createTicket();
                if (retry) {
                    return yield this.getDomains(false);
                }
            }
            try {
                const cookie = `PMGAuthCookie=${this.ticket};  Path=/; Expires=Sat, 04 May 2024 14:42:19 GMT;`;
                const req = yield superagent_1.default
                    .get(`${this.host}/api2/json/config/domains`)
                    .disableTLSCerts()
                    .set('cookie', cookie)
                    .timeout(6000);
                if (req.status === 200) {
                    const list = [];
                    for (const item of req.body.data) {
                        const domain = new Domain_1.ProxmoxDomain();
                        domain.domain = item.domain;
                        domain.comment = item.comment;
                        list.push(domain);
                    }
                    return list;
                }
                else if (req.status === 401) {
                    yield this.createTicket();
                    if (retry) {
                        return yield this.getDomains(false);
                    }
                }
                return [];
            }
            catch (e) {
                return [];
            }
        });
    }
    static addDomain(domain, retry = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ticket == null) {
                yield this.createTicket();
                if (retry) {
                    return yield this.addDomain(domain, false);
                }
            }
            try {
                const cookie = `PMGAuthCookie=${this.ticket};  Path=/; Expires=Sat, 04 May 2024 14:42:19 GMT;`;
                const req = yield superagent_1.default
                    .post(`${this.host}/api2/json/config/domains`)
                    .send(domain)
                    .disableTLSCerts()
                    .set('cookie', cookie)
                    .set('CSRFPreventionToken', this.csrf)
                    .timeout(6000);
                if (req.status === 200) {
                    return true;
                }
                else if (req.status === 401) {
                    yield this.createTicket();
                    if (retry) {
                        return yield this.addDomain(domain, false);
                    }
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
    }
    static removeDomain(domain, retry = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ticket == null) {
                yield this.createTicket();
                if (retry) {
                    return yield this.removeDomain(domain, false);
                }
            }
            try {
                const cookie = `PMGAuthCookie=${this.ticket};  Path=/; Expires=Sat, 04 May 2024 14:42:19 GMT;`;
                const req = yield superagent_1.default
                    .delete(`${this.host}/api2/json/config/domains/${domain.domain}`)
                    .disableTLSCerts()
                    .set('cookie', cookie)
                    .set('CSRFPreventionToken', this.csrf)
                    .timeout(6000);
                if (req.status === 200) {
                    return true;
                }
                else if (req.status === 401) {
                    yield this.createTicket();
                    if (retry) {
                        return yield this.removeDomain(domain, false);
                    }
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
    }
    static addTransport(transport, retry = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ticket == null) {
                yield this.createTicket();
                if (retry) {
                    return yield this.addTransport(transport, false);
                }
            }
            try {
                const cookie = `PMGAuthCookie=${this.ticket};  Path=/; Expires=Sat, 04 May 2024 14:42:19 GMT;`;
                const req = yield superagent_1.default
                    .post(`${this.host}/api2/json/config/transport`)
                    .send(transport)
                    .disableTLSCerts()
                    .set('cookie', cookie)
                    .set('CSRFPreventionToken', this.csrf)
                    .timeout(6000);
                if (req.status === 200) {
                    return true;
                }
                else if (req.status === 401) {
                    yield this.createTicket();
                    if (retry) {
                        return yield this.addTransport(transport, false);
                    }
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
    }
    static removeTransport(transport, retry = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ticket == null) {
                yield this.createTicket();
                if (retry) {
                    return yield this.removeTransport(transport, false);
                }
            }
            try {
                const cookie = `PMGAuthCookie=${this.ticket};  Path=/; Expires=Sat, 04 May 2024 14:42:19 GMT;`;
                const req = yield superagent_1.default
                    .delete(`${this.host}/api2/json/config/transport/${transport.domain}`)
                    .disableTLSCerts()
                    .set('cookie', cookie)
                    .set('CSRFPreventionToken', this.csrf)
                    .timeout(6000);
                if (req.status === 200) {
                    return true;
                }
                else if (req.status === 401) {
                    yield this.createTicket();
                    if (retry) {
                        return yield this.removeTransport(transport, false);
                    }
                }
                return false;
            }
            catch (e) {
                return false;
            }
        });
    }
    static getTransports(retry = true) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ticket == null) {
                yield this.createTicket();
                if (retry) {
                    return yield this.getTransports(false);
                }
            }
            try {
                const cookie = `PMGAuthCookie=${this.ticket};  Path=/; Expires=Sat, 04 May 2024 14:42:19 GMT;`;
                const req = yield superagent_1.default
                    .get(`${this.host}/api2/json/config/transport`)
                    .disableTLSCerts()
                    .set('cookie', cookie)
                    .timeout(6000);
                if (req.status === 200) {
                    const list = [];
                    for (const item of req.body.data) {
                        const transport = new Transport_1.ProxmoxTransport();
                        transport.port = item.port;
                        transport.host = item.host;
                        transport.use_mx = item.use_mx;
                        transport.protocol = item.protocol;
                        transport.domain = item.domain;
                        transport.comment = item.comment;
                        list.push(transport);
                    }
                    return list;
                }
                else if (req.status === 401) {
                    yield this.createTicket();
                    if (retry) {
                        return yield this.getTransports(false);
                    }
                }
                return [];
            }
            catch (e) {
                return [];
            }
        });
    }
}
ProxmoxService.host = `https://${process.env.PROXMOX_HOST}:8006`;
exports.ProxmoxService = ProxmoxService;
//# sourceMappingURL=ProxmoxService.js.map