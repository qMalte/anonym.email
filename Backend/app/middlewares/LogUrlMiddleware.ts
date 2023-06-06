import express from "express";
import {LoggingHelper} from "../../helpers/LoggingHelper";

export default (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const log = new LoggingHelper(__dirname);
    let ip = req.ip;

    if (req.ip.includes("::ffff:")) {
        ip = req.ip.replace('::ffff:', '');
    }

    log.info(req.method + " - " + req.url);
    next();
};
