"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.MailAliasController = void 0;
const SystemResources_1 = require("../../resources/SystemResources");
const ValidationResources_1 = require("../../resources/ValidationResources");
const MailAlias_1 = require("../models/MailAlias");
const StringHelper_1 = require("../../helpers/StringHelper");
const EntityRegistry_1 = require("../../database/EntityRegistry");
const validator_1 = __importDefault(require("validator"));
const User_1 = require("../models/User");
const MailcowService_1 = require("../services/Mailcow/MailcowService");
const UserService_1 = require("../services/UserService");
const AuthenticationResources_1 = require("../../resources/AuthenticationResources");
const process = __importStar(require("process"));
const MailService_1 = require("../services/MailService");
class MailAliasController {
    GetAliases(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (yield UserService_1.UserService.hasPermission(res.locals.user_id, 'aliases', false)) {
                    const aliases = yield EntityRegistry_1.EntityRegistry.getInstance().MailAlias.find({
                        relations: {
                            user: true
                        }
                    });
                    return res.status(200).send(aliases);
                }
                else {
                    return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
                }
            }
            catch (e) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
        });
    }
    GetOwnAliases(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield EntityRegistry_1.EntityRegistry.getInstance().User.findOne({
                    where: { id: res.locals.user_id },
                    relations: {
                        aliases: true
                    }
                });
                return res.status(200).send(user.aliases);
            }
            catch (e) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
        });
    }
    PostMailAlias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.email == null) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.MissingMailAddressCreationInformation);
                }
                if (!validator_1.default.isEmail(req.body.email.toString())) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.MailAddressCouldNotValidated);
                }
                let user = yield EntityRegistry_1.EntityRegistry.getInstance().User.findOne({
                    where: { email: req.body.email.toLowerCase() },
                    relations: {
                        aliases: true
                    }
                });
                if (user == null) {
                    user = new User_1.User();
                    user.email = req.body.email.toLowerCase();
                    yield user.save();
                }
                else {
                    if (user.aliases.length > user.aliasLimit) {
                        return res.status(400).send(ValidationResources_1.ValidationResources.MailAddressLimitReached);
                    }
                }
                let mailAlias = new MailAlias_1.MailAlias();
                let length = 4;
                mailAlias.mailbox = StringHelper_1.StringHelper.Generate(length).toLowerCase();
                mailAlias.user = user;
                while ((yield EntityRegistry_1.EntityRegistry.getInstance().MailAlias.findOne({ where: { mailbox: mailAlias.mailbox } })) != null) {
                    mailAlias.mailbox = StringHelper_1.StringHelper.Generate(length++).toLowerCase();
                }
                const blacklist = process.env.BLACKLIST.split(';');
                while (blacklist.includes(mailAlias.mailbox)) {
                    mailAlias.mailbox = StringHelper_1.StringHelper.Generate(length++).toLowerCase();
                }
                if (yield MailcowService_1.MailcowService.getInstance().addAlias(mailAlias.mailbox, user.email)) {
                    mailAlias = yield mailAlias.save();
                }
                else {
                    return res.status(500).send(SystemResources_1.SystemResources.ServerError);
                }
                const mail = new MailService_1.MailService(user.email, 'Dein Alias wurde erstellt.', MailService_1.Template.ALIAS_CREATED, [mailAlias.mailbox + '@anonym.email']);
                yield mail.send();
                return res.status(200).send(mailAlias);
            }
            catch (e) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
        });
    }
    DeleteOwnAlias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.params.id == null) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.MissingMailAliasId);
                }
                if (!validator_1.default.isInt(req.params.id.toString())) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.MailAliasIdValidationFailed);
                }
                const user = yield EntityRegistry_1.EntityRegistry.getInstance().User.findOne({
                    where: { id: res.locals.user_id },
                    relations: {
                        aliases: true
                    }
                });
                const alias = user.aliases.find(x => x.id === +req.params.id);
                if (alias == null) {
                    return res.status(404).send(ValidationResources_1.ValidationResources.AliasNotFound);
                }
                if (yield MailcowService_1.MailcowService.getInstance().deleteAlias(alias.mailbox)) {
                    yield alias.remove();
                    return res.status(200).end();
                }
                res.status(500).end();
            }
            catch (e) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
        });
    }
    DeleteAlias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.params.id == null) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.MissingMailAliasId);
                }
                if (!validator_1.default.isInt(req.params.id.toString())) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.MailAliasIdValidationFailed);
                }
                if (yield UserService_1.UserService.hasPermission(res.locals.user_id, 'aliases', true)) {
                    const alias = yield EntityRegistry_1.EntityRegistry.getInstance().MailAlias.findOne({
                        where: { id: +req.params.id }
                    });
                    if (alias == null) {
                        return res.status(404).send(ValidationResources_1.ValidationResources.AliasNotFound);
                    }
                    if (yield MailcowService_1.MailcowService.getInstance().deleteAlias(alias.mailbox)) {
                        yield alias.remove();
                        return res.status(200).end();
                    }
                    res.status(500).end();
                }
                else {
                    return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
                }
            }
            catch (e) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
        });
    }
    PutCustomNameOfAlias(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (req.body.alias_id == null) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.MissingMailAliasId);
                }
                if (req.body.customName == null) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.MissingMailAliasCustomName);
                }
                if (!validator_1.default.isInt(req.body.alias_id.toString())) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.MissingMailAliasCustomName);
                }
                if (!validator_1.default.isAlphanumeric(req.body.customName.toString())) {
                    return res.status(400).send(ValidationResources_1.ValidationResources.MailAliasCustomNameValidationFailed);
                }
                const user = yield EntityRegistry_1.EntityRegistry.getInstance().User.findOne({
                    where: { id: res.locals.user_id },
                    relations: {
                        aliases: true
                    }
                });
                const alias = user.aliases.find(x => x.id === +req.body.alias_id);
                if (alias == null) {
                    return res.status(404).send(ValidationResources_1.ValidationResources.AliasNotFound);
                }
                alias.customName = req.body.customName;
                yield alias.save();
                return res.status(200).end();
            }
            catch (e) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
        });
    }
}
exports.MailAliasController = MailAliasController;
//# sourceMappingURL=MailAliasController.js.map