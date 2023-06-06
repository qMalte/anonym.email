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
exports.RemoteService = void 0;
const rcon_client_1 = require("rcon-client");
const LoggingHelper_1 = require("../../../../helpers/LoggingHelper");
class RemoteService {
    constructor() {
        this._log = new LoggingHelper_1.LoggingHelper(__dirname);
        //
    }
    sendCommand(gs, cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.connector = yield rcon_client_1.Rcon.connect({
                    host: gs.host, port: gs.gamePort, password: gs.RCONPassword
                });
                console.log(yield this.connector.send(cmd));
                yield this.connector.end();
                return true;
            }
            catch (e) {
                return false;
            }
        });
    }
    isOnline(gs) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.sendCommand(gs, 'status');
        });
    }
    static getInstance() {
        if (this._Instance == null)
            this._Instance = new RemoteService();
        return this._Instance;
    }
}
exports.RemoteService = RemoteService;
//# sourceMappingURL=RemoteService.js.map