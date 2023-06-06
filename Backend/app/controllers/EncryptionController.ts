import express from "express";
import {SystemResources} from "../../resources/SystemResources";
import fs from "fs";
import {LoggingHelper} from "../../helpers/LoggingHelper";

export class EncryptionController {

    GetPublicKey(req: express.Request, res: express.Response) {
        const log = new LoggingHelper(__dirname);
        try {
            const publicKey = fs.readFileSync(__dirname + '/../../storage/keys/client_public.key').toString().replace(/\n/g, '');
            res.status(200).send({
                publicKey
            });
        } catch (e) {
            log.error(e);
            res.status(500).send(SystemResources.ServerError);
        }
    }


}
