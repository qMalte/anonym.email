import express from "express";
import {DateHelper} from "../../helpers/DateHelper";
import bcrypt from "bcrypt";
import {EntityRegistry} from "../../database/EntityRegistry";
import {LoggingHelper} from "../../helpers/LoggingHelper";

export default async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const log = new LoggingHelper(__dirname);
    const authorizationToken = req.header("Authorization");

    let ip = req.ip;

    if (req.ip.includes("::ffff:")) {
        ip = req.ip.replace('::ffff:', '');
    }

    if (authorizationToken != null && authorizationToken !== "") {
        const session = await EntityRegistry.getInstance().Session.findOneBy({
            prefix: authorizationToken.substring(0, 16)
        });
        if (session != null && await bcrypt.compare(authorizationToken, session.secret)) {

            if (session.expired_at >= new Date()) {

                log.debug(`Authentifizierungs-Versuch - Match IP: ${session.ip} -> ${ip}`);

                if (session.ip === ip) {

                    // One Factor (Username and Password AuthenticationResources)
                    const user = await EntityRegistry.getInstance().User.findOneBy({
                        id: session.user_id
                    });

                    res.locals.user_id = session.user_id;

                    if (user.otpActive && !session.isVerified) {
                        return res.status(403).send({
                            reason: "otp_required"
                        });
                    }

                    if (!user.isActive) {
                        return res.status(403).send({
                            reason: 'account_deactivated'
                        });
                    }

                    session.expired_at = DateHelper.addMinutes(60);
                    res.locals.session = session;
                    await session.save();
                    next();
                    return;

                } else {
                    session.expired_at = new Date();
                    await session.save();
                    return res.status(401).send({
                        reason: "ip_validation_failed"
                    });
                }

            } else {
                return res.status(401).send({
                    reason: "session_expired"
                });
            }

        } else {
            return res.status(401).send({
                reason: "authorization_token_mismatch"
            });
        }
    } else {
        return res.status(400).send({
            reason: "authorization_header_empty"
        });
    }
};
