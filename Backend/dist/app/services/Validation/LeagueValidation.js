"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeagueValidation = void 0;
const validator_1 = __importDefault(require("validator"));
const ValidationBase_1 = require("./core/ValidationBase");
class LeagueValidation extends ValidationBase_1.ValidationBase {
    validate(league) {
        this.resetErrors();
        if (league.name != null && validator_1.default.isAlphanumeric(validator_1.default.blacklist(league.name.toString(), ' '))) {
            this.addError('Der Name der Liga darf nicht aus Sonderzeichnen entstehen.');
        }
        return this.errors;
    }
    static getInstance() {
        if (this._Instance == null)
            this._Instance = new LeagueValidation();
        return this._Instance;
    }
}
exports.LeagueValidation = LeagueValidation;
//# sourceMappingURL=LeagueValidation.js.map