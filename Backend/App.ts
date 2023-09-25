import express from 'express';
import http from 'http';
import fs from 'fs';
import dotenv from "dotenv";
import https from "https";
import bodyParser from "body-parser";
import AuthRouter from "./routes/AuthRouter";
import DefaultRouter from "./routes/DefaultRouter";
import CorsMiddleware from "./app/middlewares/CorsMiddleware";
import LogUrlMiddleware from "./app/middlewares/LogUrlMiddleware";
import {DatabaseSeeder} from "./database/DatabaseSeeder";
import "reflect-metadata"
import {AppDataSource} from "./database/DatabaseProvider";
import SpamProtMiddleware from "./app/middlewares/SpamProtMiddleware";
import multer from 'multer';
import {LoggingHelper} from "./helpers/LoggingHelper";
import {DNSService} from "./app/services/DNSService";

dotenv.config();

class App {

    /* private certificates = {
        key: fs.readFileSync('./storage/keys/localhost.key'),
        cert: fs.readFileSync('./storage/keys/localhost.crt')
    }; */

    private app = express();
    private httpServer = http.createServer(this.app);
    // private httpsServer = https.createServer(this.certificates, this.app);
    private httpPort = process.env.HTTP_PORT || 8080;
    // private httpsPort = process.env.HTTPS_PORT || 8443;

    private upload = multer({dest: 'uploads/'});

    private _log = new LoggingHelper(__filename);

    async bootstrap() {
        await AppDataSource.initialize();

        if (process.env.ENABLE_SEEDING === "true") {
            await DatabaseSeeder.run();
        }

        return this;
    }

    initializeMiddlewares() {
        this.app.use(SpamProtMiddleware);
        this.app.use(CorsMiddleware);
        this.app.use(LogUrlMiddleware);
        this.app.use(bodyParser.urlencoded({extended: false}));
        this.app.use(bodyParser.json());
        this.app.use(this.upload.any());
        return this;
    }

    setupRouting() {
        this.app.use("/api/v1/auth", AuthRouter);
        this.app.use("/api/v1", DefaultRouter);
        return this;
    }

    listen() {
        this.httpServer.listen(this.httpPort, () => {
            this._log.info(`Der HTTP-Server wurde unter Port: ${this.httpPort} gestartet!`);
        });
        /* this.httpsServer.listen(this.httpsPort, () => {
            this._log.info(`Der HTTPS-Server wurde unter Port: ${this.httpsPort} gestartet!`);
        }); */
        return this;
    }

}

new App()
    .bootstrap().then(async (app: App) => {
    app
        .initializeMiddlewares()
        .setupRouting()
        .listen();
});
