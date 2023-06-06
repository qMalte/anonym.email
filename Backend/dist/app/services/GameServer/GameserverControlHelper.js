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
exports.GameServerControlHelper = void 0;
const GameserverConnector_1 = require("./GameserverConnector");
const OutputParser_1 = require("./OutputParser");
class GameServerControlHelper {
    constructor() {
        this.connector = new GameserverConnector_1.GameServerConnector();
        this.parser = new OutputParser_1.OutputParser();
    }
    getServerDetails(gs) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connector.connect(gs);
            const result = yield this.connector.execute('cd . && ./csgoserver details');
            const details = this.parser.serverDetails(result);
            yield this.connector.dispose();
            return details;
        });
    }
    restart(gs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.runCommandAndGetState(gs, 'cd . && ./csgoserver restart');
        });
    }
    stop(gs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.runCommandAndGetState(gs, 'cd . && ./csgoserver stop');
        });
    }
    start(gs) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.runCommandAndGetState(gs, 'cd . && ./csgoserver start');
        });
    }
    runCommandAndGetState(gs, cmd) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.connector.connect(gs);
            const result = yield this.connector.execute(cmd);
            const state = this.parser.actionPerformState(result);
            yield this.connector.dispose();
            return state;
        });
    }
    static getInstance() {
        if (this._Instance == null)
            this._Instance = new GameServerControlHelper();
        return this._Instance;
    }
}
exports.GameServerControlHelper = GameServerControlHelper;
//# sourceMappingURL=GameserverControlHelper.js.map