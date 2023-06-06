"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NumericHelper = void 0;
class NumericHelper {
    static Generate(length) {
        let result = '';
        const characters = '0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        if (result.startsWith('0')) {
            return this.Generate(length);
        }
        return +result;
    }
}
exports.NumericHelper = NumericHelper;
//# sourceMappingURL=NumericHelper.js.map