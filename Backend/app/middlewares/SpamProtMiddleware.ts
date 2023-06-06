import express from "express";
import {AppDataSource} from "../../database/DatabaseProvider";
import {BlacklistedIP} from "../models/BlacklistedIP";

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const ipRepo = AppDataSource.getRepository(BlacklistedIP);

    let ip = req.ip;

    if (req.ip.includes("::ffff:")) {
        ip = req.ip.replace('::ffff:', '');
    }

    const ips = await ipRepo.findBy({
        ip
    });

    for (const ipEntry of ips) {
        if (ipEntry.expired_at > new Date()) {
            return res.status(403).send({
                reason: 'ip_blacklisted'
            });
        }
    }

    next();
};
