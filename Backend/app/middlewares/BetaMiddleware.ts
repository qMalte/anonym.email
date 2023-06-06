import express from "express";
import {AuthenticationResources} from "../../resources/AuthenticationResources";
import {RSAService} from "../services/RSAService";

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {

    if (process.env.CLOSED_BETA.toLowerCase() === "true") {

        const betaKeyEncrypted = req.header("X-Beta-Token");

        if (betaKeyEncrypted == null) {
            return res.status(400).send(AuthenticationResources.EmptyBetaToken);
        }

        const betaKeyDecrypted = RSAService.decrypt(betaKeyEncrypted);

        if (betaKeyDecrypted !== process.env.CLOSED_BETA_CODE) {
            return res.status(401).send(AuthenticationResources.IncorrectBetaToken);
        }

    }

    next();

};
