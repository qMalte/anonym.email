"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchValidation = void 0;
const validator_1 = __importDefault(require("validator"));
const ValidationBase_1 = require("./core/ValidationBase");
class MatchValidation extends ValidationBase_1.ValidationBase {
    validate(match) {
        this.resetErrors();
        if (match.selfScore != null && validator_1.default.isNumeric(match.selfScore.toString())) {
            this.addError('Der Score muss eine numerische Zahl sein.');
        }
        if (match.enemyScore != null && validator_1.default.isNumeric(match.enemyScore.toString())) {
            this.addError('Der Score des Gegners muss eine numerische Zahl sein.');
        }
        if (match.enemyName != null && validator_1.default.isAlphanumeric(validator_1.default.blacklist(match.enemyName.toString(), ' '))) {
            this.addError('Der Name des Gegners darf nicht aus Sonderzeichen bestehehen.');
        }
        if (match.streamUrl != null && validator_1.default.isURL(match.streamUrl.toString())) {
            this.addError('Die Link zum Stream ist keine gültige URL.');
        }
        if (match.matchUrl != null && validator_1.default.isURL(match.matchUrl.toString())) {
            this.addError('Die Link zum Match ist keine gültige URL.');
        }
        return this.errors;
    }
    static getInstance() {
        if (this._Instance == null)
            this._Instance = new MatchValidation();
        return this._Instance;
    }
}
exports.MatchValidation = MatchValidation;
//# sourceMappingURL=MatchValidation.js.map