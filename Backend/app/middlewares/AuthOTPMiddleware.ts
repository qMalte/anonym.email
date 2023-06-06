import express from "express";
import {Session} from "../models/Session";
import {User} from "../models/User";
import {DateHelper} from "../../helpers/DateHelper";
import {AppDataSource} from "../../database/DatabaseProvider";
import bcrypt from "bcrypt";

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const sessionRepo = AppDataSource.getRepository(Session);
    const userRepo = AppDataSource.getRepository(User);
    const authorizationToken = req.header("Authorization");

    let ip = req.ip;

    if (req.ip.includes("::ffff:")) {
        ip = req.ip.replace('::ffff:', '');
    }

    if (authorizationToken != null && authorizationToken != "") {
        const session = await sessionRepo.findOneBy({
            prefix: authorizationToken.substring(0, 16)
        });
        if (session != null && await bcrypt.compare(authorizationToken, session.secret)) {

            if (session.expired_at >= new Date()) {

                if (session.ip == ip) {

                    // One Factor (Username and Password AuthenticationResources)
                    const user = await userRepo.findOneBy({
                        id: session.user_id
                    });

                    if (user.otpActive && !session.isVerified) {
                        res.locals.user_id = session.user_id;
                        next();
                        return;
                    } else if (user.otpActive && session.isVerified) {
                        return res.status(400).send({
                            reason: 'Already Authenticated!'
                        });
                    } else {
                        return res.status(400).send({
                            reason: 'OTP-AuthenticationResources is not be enabled!'
                        });
                    }

                } else {
                    await sessionRepo
                        .createQueryBuilder()
                        .update({
                            expired_at: new Date()
                        })
                        .where({
                            id: session.id
                        })
                        .execute();
                    return res.status(401).send({
                        reason: "The saved IP-Address don't match with the Request Header"
                    });
                }

            } else {
                return res.status(401).send({
                    reason: "The Session is expired!"
                });
            }

        } else {
            return res.status(401).send({
                reason: "The given Authorization-Token don't match with a saved Session!"
            });
        }
    } else {
        return res.status(400).send({
            reason: "The Request don't include a required Authorization Header!"
        });
    }
};
