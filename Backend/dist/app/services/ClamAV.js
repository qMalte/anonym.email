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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClamAV = void 0;
const clamscan_1 = __importDefault(require("clamscan"));
const LoggingHelper_1 = require("../../helpers/LoggingHelper");
class ClamAV {
    constructor() {
        this._log = new LoggingHelper_1.LoggingHelper(__dirname);
    }
    isFileClean(path) {
        return new Promise(resolve => {
            const ClamScan = new clamscan_1.default().init({
                removeInfected: false,
                quarantineInfected: false,
                scanLog: null,
                debugMode: false,
                fileList: null,
                scanRecursively: true,
                clamdscan: {
                    socket: false,
                    host: '10.123.123.133',
                    port: 3310,
                    timeout: 60000,
                    localFallback: true,
                    path: '/usr/bin/clamdscan',
                    configFile: null,
                    multiscan: true,
                    reloadDb: false,
                    active: true,
                    bypassTest: false, // Check to see if socket is available when applicable
                },
                preference: 'clamdscan' // If clamdscan is found and active, it will be used by default
            }).then((clamScan) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const version = yield clamScan.getVersion();
                    const { isInfected, file, viruses } = yield clamScan.isInfected(path);
                    if (isInfected) {
                        resolve(false);
                    }
                    else {
                        resolve(true);
                    }
                }
                catch (err) {
                    resolve(false);
                }
            })).catch((e) => {
                this._log.fatal('Die Virenprüfung einer hochgeladenen Datei ist fehlgeschalgen!');
                console.log(e);
                resolve(false);
            });
        });
    }
}
exports.ClamAV = ClamAV;
//# sourceMappingURL=ClamAV.js.map