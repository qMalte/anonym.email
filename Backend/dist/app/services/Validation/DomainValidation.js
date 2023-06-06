"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DomainValidation = void 0;
const ValidationBase_1 = require("./core/ValidationBase");
const validator_1 = __importDefault(require("validator"));
class DomainValidation extends ValidationBase_1.ValidationBase {
    validate(domain) {
        this.resetErrors();
        if (domain.name != null && (!validator_1.default.isFQDN(domain.name.toString()) || !domain.name.includes('.'))) {
            this.addError('The custom domain name must be a valid domain.');
        }
        if (domain.name != null && !domain.name.includes('trimli.de')) {
            this.addError('The custom domain must be a valid Trimli MailAlias.');
        }
        if (domain.targetUrl == null || !validator_1.default.isURL(domain.targetUrl.toString())) {
            this.addError('The target URL must be a valid domain.');
        }
        if (domain.targetUrl === '') {
            this.addError('The target URL cannot be empty.');
        }
        if (domain.duration == null || !validator_1.default.isNumeric(domain.duration.toString()) || domain.duration > 86400) {
            this.addError('The expiration date must be specified as an integer in seconds.');
        }
        return this.errors;
    }
    static getInstance() {
        if (this._Instance == null)
            this._Instance = new DomainValidation();
        return this._Instance;
    }
}
exports.DomainValidation = DomainValidation;
//# sourceMappingURL=DomainValidation.js.map