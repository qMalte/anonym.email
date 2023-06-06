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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainService = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const EntityRegistry_1 = require("../../database/EntityRegistry");
const DateHelper_1 = require("../../helpers/DateHelper");
const LoggingHelper_1 = require("../../helpers/LoggingHelper");
class DomainService {
    static check() {
        node_cron_1.default.schedule('* * * * *', () => __awaiter(this, void 0, void 0, function* () {
            this._log.info('Check Domains to delete');
            const domains = yield EntityRegistry_1.EntityRegistry.getInstance().Domain.find();
            for (const domain of domains) {
                const expireAt = DateHelper_1.DateHelper.addSeconds(domain.duration, new Date(domain.createdAt));
                if (DateHelper_1.DateHelper.isExpired(expireAt)) {
                    yield domain.remove();
                }
            }
        }));
    }
}
DomainService._log = new LoggingHelper_1.LoggingHelper(__filename);
exports.DomainService = DomainService;
//# sourceMappingURL=DomainService.js.map