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
exports.LOG_LEVEL = exports.LoggingService = void 0;
const log4js_1 = __importDefault(require("log4js"));
const dotenv_1 = __importDefault(require("dotenv"));
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
const Log_1 = require("../models/Log");
dotenv_1.default.config();
class LoggingService {
    static getConfiguration() {
        return log4js_1.default.configure({
            appenders: {
                out: {
                    type: 'stdout'
                },
                app: {
                    type: "file",
                    filename: "./storage/logs/latest.log"
                }
            },
            categories: {
                default: {
                    appenders: ["app", "out"],
                    level: process.env.LOG_LEVEL
                }
            },
        });
    }
    static log(title, desc, level, user_id, ip) {
        return __awaiter(this, void 0, void 0, function* () {
            const logRepo = DatabaseProvider_1.AppDataSource.getRepository(Log_1.Log);
            const log = new Log_1.Log();
            log.title = title;
            log.description = desc;
            log.level = level;
            log.user_id = user_id;
            log.ip = ip;
            yield logRepo.save(log);
        });
    }
}
exports.LoggingService = LoggingService;
var LOG_LEVEL;
(function (LOG_LEVEL) {
    LOG_LEVEL[LOG_LEVEL["DEBUG"] = 1] = "DEBUG";
    LOG_LEVEL[LOG_LEVEL["INFO"] = 2] = "INFO";
    LOG_LEVEL[LOG_LEVEL["WARNING"] = 3] = "WARNING";
    LOG_LEVEL[LOG_LEVEL["ERROR"] = 4] = "ERROR";
    LOG_LEVEL[LOG_LEVEL["FATAL"] = 5] = "FATAL";
})(LOG_LEVEL = exports.LOG_LEVEL || (exports.LOG_LEVEL = {}));
//# sourceMappingURL=LoggingService.js.map