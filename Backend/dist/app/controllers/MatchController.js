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
exports.MatchController = void 0;
const validator_1 = __importDefault(require("validator"));
const UserService_1 = require("../services/UserService");
const EntityRegistry_1 = require("../../database/EntityRegistry");
const Asset_1 = require("../models/Asset");
const Match_1 = require("../models/Match");
const MatchValidation_1 = require("../services/Validation/MatchValidation");
class MatchController {
    GetMatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id == null || !validator_1.default.isNumeric(req.params.id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            try {
                const match = yield EntityRegistry_1.EntityRegistry.getInstance().Match.findOne({
                    relations: {
                        enemyLogo: true,
                        team: true,
                        league: true
                    },
                    where: {
                        id: +req.params.id
                    }
                });
                if (match != null) {
                    res.status(200).send(match);
                }
                else {
                    res.status(404).end();
                }
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    GetMatchesByTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.teamId == null || !validator_1.default.isNumeric(req.params.teamId.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            try {
                const team = yield EntityRegistry_1.EntityRegistry.getInstance().Team.findOneBy({ id: +req.params.teamId });
                if (team == null) {
                    return res.status(404).send({
                        reason: 'team_not_found'
                    });
                }
                const matches = yield EntityRegistry_1.EntityRegistry.getInstance().Match.find({
                    relations: {
                        enemyLogo: true,
                        team: true,
                        league: true
                    },
                    where: {
                        team: {
                            id: team.id
                        }
                    }
                });
                res.status(200).send(matches);
            }
            catch (e) {
                console.log(e);
                res.status(500).end();
            }
        });
    }
    SaveMatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body == null) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            try {
                const user = yield UserService_1.UserService.getUserById(res.locals.user_id);
                const match = Object.assign(new Match_1.Match(), req.body);
                const savedMatch = yield EntityRegistry_1.EntityRegistry.getInstance().Match.findOne({
                    relations: {
                        enemyLogo: true
                    },
                    where: {
                        id: match.id
                    }
                });
                if (match.enemyLogo != null && (savedMatch.enemyLogo == null || match.enemyLogo.id != savedMatch.enemyLogo.id)) {
                    match.enemyLogo = Object.assign(new Asset_1.Asset(), match.enemyLogo);
                    match.enemyLogo.released_at = null;
                    match.enemyLogo.released_by = null;
                    yield match.enemyLogo.save();
                }
                if (user.team.id != match.team.id) {
                    return res.status(403).end();
                }
                const validationErrors = MatchValidation_1.MatchValidation.getInstance().validate(match);
                if (validationErrors.length > 0) {
                    return res.status(400).send({
                        reason: 'validation_error',
                        errors: validationErrors
                    });
                }
                yield match.save();
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    DelMatch(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id == null || !validator_1.default.isNumeric(req.params.id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            try {
                const user = yield UserService_1.UserService.getUserById(res.locals.user_id);
                const match = yield EntityRegistry_1.EntityRegistry.getInstance().Match.findOne({
                    relations: {
                        enemyLogo: true
                    },
                    where: {
                        id: +req.params.id
                    }
                });
                if (match == null) {
                    return res.status(404).end();
                }
                if (user.team.id != match.team.id) {
                    return res.status(403).end();
                }
                if (match.enemyLogo != null) {
                    yield match.enemyLogo.remove();
                }
                yield match.remove();
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
}
exports.MatchController = MatchController;
//# sourceMappingURL=MatchController.js.map