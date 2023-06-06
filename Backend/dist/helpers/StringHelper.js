"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StringHelper = void 0;
class StringHelper {
    static Generate(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
}
exports.StringHelper = StringHelper;
//# sourceMappingURL=StringHelper.js.map