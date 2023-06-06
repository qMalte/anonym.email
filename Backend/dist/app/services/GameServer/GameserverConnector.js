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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameServerConnector = void 0;
const LoggingHelper_1 = require("../../../helpers/LoggingHelper");
const { NodeSSH } = require('node-ssh');
class GameServerConnector {
    constructor() {
        this._log = new LoggingHelper_1.LoggingHelper(__dirname);
        this.ssh = new NodeSSH();
    }
    connect(gs) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.ssh = yield this.ssh.connect({
                    host: gs.host,
                    port: gs.sshPort,
                    username: gs.sshUsername,
                    password: gs.sshPassword,
                });
                return this.ssh.isConnected();
            }
            catch (e) {
                this._log.error('Fehler, beim Verbinden mittels SSH auf einen GameServer.');
                return false;
            }
        });
    }
    execute(cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this.ssh.execCommand(cmd);
                return response.stdout;
            }
            catch (e) {
                this._log.error('Fehler, beim Ausführen eines SSH-Befehls auf einen GameServer.');
                return null;
            }
        });
    }
    dispose() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.ssh.dispose();
            }
            catch (e) {
                this._log.error('Fehler, beim Trennen der SSH-Verbindung zu einem GameServer.');
            }
        });
    }
}
exports.GameServerConnector = GameServerConnector;
//# sourceMappingURL=GameserverConnector.js.map