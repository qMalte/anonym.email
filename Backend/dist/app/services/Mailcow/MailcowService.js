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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailcowService = void 0;
const superagent = __importStar(require("superagent"));
const MailcowAlias_1 = require("./MailcowAlias");
class MailcowService {
    constructor() {
        this.domain = 'anonym.email';
    }
    getAliases() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `https://${process.env.MAILCOW_HOSTNAME}/api/v1/get/alias/all`;
                const res = yield superagent
                    .get(url)
                    .set('X-API-Key', process.env.MAILCOW_API_KEY);
                const aliases = [];
                res.body.forEach((alias) => {
                    aliases.push(Object.assign(new MailcowAlias_1.MailcowAlias(), alias));
                });
                return aliases;
            }
            catch (e) {
                if (e.status != null) {
                    console.error(`Error while get Mailcow aliases: ${e.status}`);
                }
                return null;
            }
        });
    }
    addAlias(alias, targetAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const url = `https://${process.env.MAILCOW_HOSTNAME}/api/v1/add/alias`;
                const mailAlias = `${alias}@${this.domain}`;
                const res = yield superagent
                    .post(url)
                    .set('X-API-Key', process.env.MAILCOW_API_KEY)
                    .send({
                    address: mailAlias,
                    goto: targetAddress,
                    active: (1).toString()
                });
                return res.status === 200;
            }
            catch (e) {
                return false;
            }
        });
    }
    deleteAlias(address) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!address.includes('@')) {
                    address = `${address}@${this.domain}`;
                }
                const aliases = yield this.getAliases();
                const aliasObj = aliases.find(x => x.address === address);
                const url = `https://${process.env.MAILCOW_HOSTNAME}/api/v1/delete/alias`;
                const data = [
                    aliasObj.id.toString()
                ];
                const res = yield superagent
                    .post(url)
                    .set('X-API-Key', process.env.MAILCOW_API_KEY)
                    .send(data);
                return res.status === 200;
            }
            catch (e) {
                return false;
            }
        });
    }
    static getInstance() {
        if (this._instance == null) {
            this._instance = new MailcowService();
        }
        return this._instance;
    }
}
exports.MailcowService = MailcowService;
//# sourceMappingURL=MailcowService.js.map