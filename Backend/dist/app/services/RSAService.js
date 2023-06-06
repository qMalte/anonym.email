"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RSAService = void 0;
const crypto_1 = __importDefault(require("crypto"));
const fs_1 = __importDefault(require("fs"));
class RSAService {
    static decrypt(encryptedString) {
        try {
            const keyFile = fs_1.default.readFileSync(__dirname + '/../../storage/keys/server_private.key', 'utf-8');
            const decryptedData = crypto_1.default.privateDecrypt({
                key: keyFile,
                padding: crypto_1.default.constants.RSA_PKCS1_PADDING
            }, Buffer.from(encryptedString, "base64"));
            return decryptedData.toString();
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
    static encrypt(decryptedString, publicKey = null) {
        if (publicKey == null) {
            return decryptedString;
        }
        try {
            return crypto_1.default.publicEncrypt({
                key: publicKey,
                padding: crypto_1.default.constants.RSA_PKCS1_PADDING
            }, Buffer.from(decryptedString)).toString("base64");
        }
        catch (err) {
            console.log(err);
            return null;
        }
    }
}
exports.RSAService = RSAService;
//# sourceMappingURL=RSAService.js.map