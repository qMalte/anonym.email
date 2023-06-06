import express from "express";
import {RSAService} from "../services/RSAService";
import * as process from "process";
import {SystemResources} from "../../resources/SystemResources";

export class TestController {

    getBetaStatus(req: express.Request, res: express.Response) {
        try {
            const state = process.env.CLOSED_BETA.toLowerCase() === "true";
            res.status(200).send({
                state
            });
        } catch (e) {
            res.status(500).end(SystemResources.ServerError);
        }
    }

}
