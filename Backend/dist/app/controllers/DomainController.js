"use strict";
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
exports.DomainController = void 0;
const SystemResources_1 = require("../../resources/SystemResources");
const ValidationResources_1 = require("../../resources/ValidationResources");
const MailAlias_1 = require("../models/MailAlias");
const StringHelper_1 = require("../../helpers/StringHelper");
const EntityRegistry_1 = require("../../database/EntityRegistry");
const validator_1 = __importDefault(require("validator"));
const User_1 = require("../models/User");
class DomainController {
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
                    where: { email: req.body.email },
                    relations: {
                        aliases: true
                    }
                });
                if (user == null) {
                    user = new User_1.User();
                    user.email = req.body.email;
                    yield user.save();
                }
                let domain = new MailAlias_1.MailAlias();
                let length = 4;
                domain.mailbox = StringHelper_1.StringHelper.Generate(length);
                domain.user = user;
                while ((yield EntityRegistry_1.EntityRegistry.getInstance().MailAlias.findOne({ where: { mailbox: domain.mailbox } })) != null) {
                    domain.mailbox = StringHelper_1.StringHelper.Generate(length++);
                }
                domain = yield domain.save();
                return res.status(200).send(domain);
            }
            catch (e) {
                return res.status(500).send(SystemResources_1.SystemResources.ServerError);
            }
        });
    }
}
exports.DomainController = DomainController;
//# sourceMappingURL=MailAliasController.js.map
