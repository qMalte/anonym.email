"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionController = void 0;
const SystemResources_1 = require("../../resources/SystemResources");
const fs_1 = __importDefault(require("fs"));
const LoggingHelper_1 = require("../../helpers/LoggingHelper");
class EncryptionController {
    GetPublicKey(req, res) {
        const log = new LoggingHelper_1.LoggingHelper(__dirname);
        try {
            const publicKey = fs_1.default.readFileSync(__dirname + '/../../storage/keys/client_public.key').toString().replace(/\n/g, '');
            res.status(200).send({
                publicKey
            });
        }
        catch (e) {
            log.error(e);
            res.status(500).send(SystemResources_1.SystemResources.ServerError);
        }
    }
}
exports.EncryptionController = EncryptionController;
//# sourceMappingURL=EncryptionController.js.map