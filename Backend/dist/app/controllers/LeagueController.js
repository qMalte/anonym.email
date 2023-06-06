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
exports.LeagueController = void 0;
const validator_1 = __importDefault(require("validator"));
const UserService_1 = require("../services/UserService");
const EntityRegistry_1 = require("../../database/EntityRegistry");
const League_1 = require("../models/League");
const LeagueValidation_1 = require("../services/Validation/LeagueValidation");
const Asset_1 = require("../models/Asset");
class LeagueController {
    GetLeague(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id == null || !validator_1.default.isNumeric(req.params.id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            try {
                const league = yield EntityRegistry_1.EntityRegistry.getInstance().League.findOne({
                    relations: {
                        logo: true,
                        team: true
                    },
                    where: {
                        id: +req.params.id
                    }
                });
                if (league != null) {
                    res.status(200).send(league);
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
    GetLeaguesByTeam(req, res) {
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
                const leagues = yield EntityRegistry_1.EntityRegistry.getInstance().League.find({
                    relations: {
                        logo: true,
                        team: true
                    },
                    where: {
                        team: {
                            id: team.id
                        }
                    }
                });
                res.status(200).send(leagues);
            }
            catch (e) {
                console.log(e);
                res.status(500).end();
            }
        });
    }
    SaveLeague(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body == null) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            try {
                const user = yield UserService_1.UserService.getUserById(res.locals.user_id);
                const league = Object.assign(new League_1.League(), req.body);
                const savedLeague = yield EntityRegistry_1.EntityRegistry.getInstance().League.findOne({
                    relations: {
                        logo: true
                    },
                    where: {
                        id: league.id
                    }
                });
                if (league.logo != null && (savedLeague.logo == null || league.logo.id != savedLeague.logo.id)) {
                    league.logo = Object.assign(new Asset_1.Asset(), league.logo);
                    league.logo.released_at = null;
                    league.logo.released_by = null;
                    yield league.logo.save();
                }
                if (user.team.id != league.team.id) {
                    return res.status(403).end();
                }
                const validationErrors = LeagueValidation_1.LeagueValidation.getInstance().validate(league);
                if (validationErrors.length > 0) {
                    return res.status(400).send({
                        reason: 'validation_error',
                        errors: validationErrors
                    });
                }
                yield league.save();
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    DelLeague(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id == null || !validator_1.default.isNumeric(req.params.id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            try {
                const user = yield UserService_1.UserService.getUserById(res.locals.user_id);
                const league = yield EntityRegistry_1.EntityRegistry.getInstance().League.findOne({
                    relations: {
                        team: true,
                        logo: true,
                        matches: true
                    },
                    where: {
                        id: +req.params.id
                    }
                });
                if (league == null) {
                    return res.status(404).end();
                }
                if (user.team.id != league.team.id) {
                    return res.status(403).end();
                }
                for (const match of league.matches) {
                    yield match.remove();
                }
                if (league.logo != null) {
                    yield league.logo.remove();
                }
                yield league.remove();
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
}
exports.LeagueController = LeagueController;
//# sourceMappingURL=LeagueController.js.map