import {SystemResources} from "../../resources/SystemResources";
import {ValidationResources} from "../../resources/ValidationResources";
import {MailAlias} from "../models/MailAlias";
import {StringHelper} from "../../helpers/StringHelper";
import {EntityRegistry} from "../../database/EntityRegistry";
import validator from "validator";
import {User} from "../models/User";
import express from "express";
import {MailcowService} from "../services/Mailcow/MailcowService";
import {UserService} from "../services/UserService";
import {AuthenticationResources} from "../../resources/AuthenticationResources";
import * as process from "process";
import {MailService, Template} from "../services/MailService";
import normalizeEmail = validator.normalizeEmail;
import {DNSService} from "../services/DNSService";

export class MailAliasController {

    async GetAliases(req: express.Request, res: express.Response) {
        try {
            if (await UserService.hasPermission(res.locals.user_id, 'aliases', false)) {
                const aliases = await EntityRegistry.getInstance().MailAlias.find({
                    relations: {
                        user: true
                    }
                });
                return res.status(200).send(aliases);
            } else {
                return res.status(403).send(AuthenticationResources.PermissionDenied);
            }

        } catch (e) {
            return res.status(500).send(SystemResources.ServerError);
        }
    }

    async GetOwnAliases(req: express.Request, res: express.Response) {
        try {

            const user = await EntityRegistry.getInstance().User.findOne({
                where: {id: res.locals.user_id},
                relations: {
                    aliases: true
                }
            });

            return res.status(200).send(user.aliases);

        } catch (e) {
            return res.status(500).send(SystemResources.ServerError);
        }
    }

    async PostMailAlias(req: express.Request, res: express.Response) {
        try {

            if (req.body.email == null) {
                return res.status(400).send(ValidationResources.MissingMailAddressCreationInformation);
            }

            if (!validator.isEmail(req.body.email.toString())) {
                return res.status(400).send(ValidationResources.MailAddressCouldNotValidated);
            }

            const requestedMail = req.body.email.toString();
            const requestedMailArr = requestedMail.split('@');

            if (requestedMailArr.length !== 2) {
                return res.status(400).send(ValidationResources.InvalidFormatOfMailAddress);
            }

            const requestedMailDomain = requestedMailArr[1];

            if (await DNSService.hasMxRecord(requestedMailDomain) === false) {
                return res.status(400).send(ValidationResources.InvalidMail);
            }

            let user = await EntityRegistry.getInstance().User.findOne({
                where: {email: req.body.email.toLowerCase()},
                relations: {
                    aliases: true
                }
            });

            if (user == null) {
                user = new User();
                user.email = req.body.email.toLowerCase();
                await user.save();
            } else {
                if (user.aliases.length > user.aliasLimit) {
                    return res.status(400).send(ValidationResources.MailAddressLimitReached);
                }
            }

            let mailAlias = new MailAlias();
            let length = 4;
            mailAlias.mailbox = StringHelper.Generate(length).toLowerCase();
            mailAlias.user = user;

            while ((await EntityRegistry.getInstance().MailAlias.findOne({where: {mailbox: mailAlias.mailbox}})) != null) {
                mailAlias.mailbox = StringHelper.Generate(length++).toLowerCase();
            }

            const blacklist = process.env.BLACKLIST.split(';');
            while (blacklist.includes(mailAlias.mailbox)) {
                mailAlias.mailbox = StringHelper.Generate(length++).toLowerCase();
            }

            if (await MailcowService.getInstance().addAlias(mailAlias.mailbox, user.email)) {
                mailAlias = await mailAlias.save();
            } else {
                return res.status(500).send(SystemResources.ServerError);
            }

            const mail = new MailService(user.email,
                'Dein Alias wurde erstellt.',
                Template.ALIAS_CREATED,
                [mailAlias.mailbox + '@anonym.email']);
            await mail.send();

            return res.status(200).send(mailAlias);

        } catch (e) {
            return res.status(500).send(SystemResources.ServerError);
        }
    }

    async DeleteOwnAlias(req: express.Request, res: express.Response) {
        try {

            if (req.params.id == null) {
                return res.status(400).send(ValidationResources.MissingMailAliasId);
            }

            if (!validator.isInt(req.params.id.toString())) {
                return res.status(400).send(ValidationResources.MailAliasIdValidationFailed);
            }

            const user = await EntityRegistry.getInstance().User.findOne({
                where: {id: res.locals.user_id},
                relations: {
                    aliases: true
                }
            });

            const alias = user.aliases.find(x => x.id === +req.params.id);

            if ( alias == null ) {
                return res.status(404).send(ValidationResources.AliasNotFound);
            }

            if (await MailcowService.getInstance().deleteAlias(alias.mailbox)) {
                await alias.remove();

                return res.status(200).end();
            }

            res.status(500).end();

        } catch (e) {
            return res.status(500).send(SystemResources.ServerError);
        }
    }

    async DeleteAlias(req: express.Request, res: express.Response) {
        try {

            if (req.params.id == null) {
                return res.status(400).send(ValidationResources.MissingMailAliasId);
            }

            if (!validator.isInt(req.params.id.toString())) {
                return res.status(400).send(ValidationResources.MailAliasIdValidationFailed);
            }

            if (await UserService.hasPermission(res.locals.user_id, 'aliases', true)) {

                const alias = await EntityRegistry.getInstance().MailAlias.findOne({
                    where: {id: +req.params.id}
                });

                if (alias == null) {
                    return res.status(404).send(ValidationResources.AliasNotFound);
                }

                if (await MailcowService.getInstance().deleteAlias(alias.mailbox)) {
                    await alias.remove();
                    return res.status(200).end();
                }

                res.status(500).end();

            } else {
                return res.status(403).send(AuthenticationResources.PermissionDenied);
            }

        } catch (e) {
            return res.status(500).send(SystemResources.ServerError);
        }
    }

    async PutCustomNameOfAlias(req: express.Request, res: express.Response) {
        try {

            if (req.body.alias_id == null) {
                return res.status(400).send(ValidationResources.MissingMailAliasId);
            }

            if (req.body.customName == null) {
                return res.status(400).send(ValidationResources.MissingMailAliasCustomName);
            }

            if (!validator.isInt(req.body.alias_id.toString())) {
                return res.status(400).send(ValidationResources.MissingMailAliasCustomName);
            }

            if (!validator.isAlphanumeric(req.body.customName.toString())) {
                return res.status(400).send(ValidationResources.MailAliasCustomNameValidationFailed);
            }

            const user = await EntityRegistry.getInstance().User.findOne({
                where: {id: res.locals.user_id},
                relations: {
                    aliases: true
                }
            });

            const alias = user.aliases.find(x => x.id === +req.body.alias_id);

            if (alias == null) {
                return res.status(404).send(ValidationResources.AliasNotFound);
            }

            alias.customName = req.body.customName;
            await alias.save();

            return res.status(200).end();

        } catch (e) {
            return res.status(500).send(SystemResources.ServerError);
        }
    }

}
