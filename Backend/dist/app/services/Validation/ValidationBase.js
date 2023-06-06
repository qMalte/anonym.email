"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationBase = void 0;
const ValidationError_1 = require("./ValidationError");
class ValidationBase {
    resetErrors() {
        this.errors = [];
    }
    addError(description) {
        this.errors.push(new ValidationError_1.ValidationError(description));
    }
}
exports.ValidationBase = ValidationBase;
//# sourceMappingURL=ValidationBase.js.map