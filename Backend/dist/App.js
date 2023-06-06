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
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const dotenv_1 = __importDefault(require("dotenv"));
const https_1 = __importDefault(require("https"));
const body_parser_1 = __importDefault(require("body-parser"));
const AuthRouter_1 = __importDefault(require("./routes/AuthRouter"));
const DefaultRouter_1 = __importDefault(require("./routes/DefaultRouter"));
const CorsMiddleware_1 = __importDefault(require("./app/middlewares/CorsMiddleware"));
const LogUrlMiddleware_1 = __importDefault(require("./app/middlewares/LogUrlMiddleware"));
const DatabaseSeeder_1 = require("./database/DatabaseSeeder");
require("reflect-metadata");
const DatabaseProvider_1 = require("./database/DatabaseProvider");
const SpamProtMiddleware_1 = __importDefault(require("./app/middlewares/SpamProtMiddleware"));
const multer_1 = __importDefault(require("multer"));
const LoggingHelper_1 = require("./helpers/LoggingHelper");
dotenv_1.default.config();
class App {
    constructor() {
        this.certificates = {
            key: fs_1.default.readFileSync('./storage/keys/localhost.key'),
            cert: fs_1.default.readFileSync('./storage/keys/localhost.crt')
        };
        this.app = (0, express_1.default)();
        this.httpServer = http_1.default.createServer(this.app);
        this.httpsServer = https_1.default.createServer(this.certificates, this.app);
        this.httpPort = process.env.HTTP_PORT || 8080;
        this.httpsPort = process.env.HTTPS_PORT || 8443;
        this.upload = (0, multer_1.default)({ dest: 'uploads/' });
        this._log = new LoggingHelper_1.LoggingHelper(__filename);
    }
    bootstrap() {
        return __awaiter(this, void 0, void 0, function* () {
            yield DatabaseProvider_1.AppDataSource.initialize();
            if (process.env.ENABLE_SEEDING === "true") {
                yield DatabaseSeeder_1.DatabaseSeeder.run();
            }
            return this;
        });
    }
    initializeMiddlewares() {
        this.app.use(SpamProtMiddleware_1.default);
        this.app.use(CorsMiddleware_1.default);
        this.app.use(LogUrlMiddleware_1.default);
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        this.app.use(body_parser_1.default.json());
        this.app.use(this.upload.any());
        return this;
    }
    setupRouting() {
        this.app.use("/api/v1/auth", AuthRouter_1.default);
        this.app.use("/api/v1", DefaultRouter_1.default);
        return this;
    }
    listen() {
        this.httpServer.listen(this.httpPort, () => {
            this._log.info(`Der HTTP-Server wurde unter Port: ${this.httpPort} gestartet!`);
        });
        this.httpsServer.listen(this.httpsPort, () => {
            this._log.info(`Der HTTPS-Server wurde unter Port: ${this.httpsPort} gestartet!`);
        });
        return this;
    }
}
new App()
    .bootstrap().then((app) => __awaiter(void 0, void 0, void 0, function* () {
    app
        .initializeMiddlewares()
        .setupRouting()
        .listen();
}));
//# sourceMappingURL=App.js.map