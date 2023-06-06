"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggingHelper = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
class LoggingHelper {
    constructor(source) {
        this.source = source;
    }
    write(message, type) {
        const day = this.format(new Date().getDay());
        const month = this.format(new Date().getMonth());
        const year = this.format(new Date().getFullYear());
        const hour = this.format(new Date().getHours());
        const minute = this.format(new Date().getHours());
        const second = this.format(new Date().getSeconds());
        const msg = `[\x1b[1m${year}-${month}-${day} ${hour}:${minute}:${second}\x1b[0m] - [${this.source}] - [${type}] ${message}`;
        // tslint:disable-next-line:no-console
        console.log(msg);
    }
    info(message) {
        this.write(message, '\x1b[32mINFO\x1b[0m');
    }
    debug(message) {
        if (process.env.DEBUG === "true") {
            this.write(message, '\x1b[36mDEBUG\x1b[0m');
        }
    }
    error(message) {
        this.write(message, '\x1b[31mERROR\x1b[0m');
    }
    fatal(message) {
        this.write(message, '\x1b[31mFATAL\x1b[0m');
    }
    warn(message) {
        this.write(message, '\x1b[33mWARN\x1b[0m');
    }
    format(input) {
        if (input < 10) {
            return '0' + input;
        }
        else {
            return input + '';
        }
    }
}
exports.LoggingHelper = LoggingHelper;
//# sourceMappingURL=LoggingHelper.js.map