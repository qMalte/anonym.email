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
exports.TeamController = void 0;
const validator_1 = __importDefault(require("validator"));
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
const Team_1 = require("../models/Team");
const User_1 = require("../models/User");
const UserService_1 = require("../services/UserService");
const AuthenticationResources_1 = require("../../resources/AuthenticationResources");
class TeamController {
    GetTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamRepo = DatabaseProvider_1.AppDataSource.getRepository(Team_1.Team);
            if (req.params.team_id == null || !validator_1.default.isNumeric(req.params.team_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'teams', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const team = yield teamRepo.findOneBy({ id: +req.params.team_id });
                if (team != null) {
                    res.status(200).send(team);
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
    GetTeams(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamRepo = DatabaseProvider_1.AppDataSource.getRepository(Team_1.Team);
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'teams', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const teams = yield teamRepo.find();
                res.status(200).send(teams);
            }
            catch (e) {
                console.log(e);
                res.status(500).end();
            }
        });
    }
    PostTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamRepo = DatabaseProvider_1.AppDataSource.getRepository(Team_1.Team);
            if (req.body.name == null || !validator_1.default.isAlphanumeric(req.body.name)) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'teams', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            const team = new Team_1.Team();
            team.name = req.body.name;
            try {
                yield teamRepo.save(team);
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PutTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamRepo = DatabaseProvider_1.AppDataSource.getRepository(Team_1.Team);
            if (req.body.team_id == null || req.body.name == null
                || !validator_1.default.isAlphanumeric(req.body.name)
                || !validator_1.default.isNumeric(req.body.team_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'teams', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const team = yield teamRepo.findOneBy({ id: req.body.team_id });
                team.name = req.body.name;
                yield teamRepo.save(team);
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    DelTeam(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamRepo = DatabaseProvider_1.AppDataSource.getRepository(Team_1.Team);
            if (req.params.team_id == null || !validator_1.default.isNumeric(req.params.team_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'teams', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                yield teamRepo.delete({ id: +req.params.team_id });
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PutSetUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const teamRepo = DatabaseProvider_1.AppDataSource.getRepository(Team_1.Team);
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            if (req.body.team_id == null || req.body.user_id == null
                || !validator_1.default.isNumeric(req.body.user_id.toString())
                || !validator_1.default.isNumeric(req.body.team_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'users', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const team = yield teamRepo.findOneBy({ id: req.body.team_id });
                const user = yield userRepo.findOneBy({ id: req.body.user_id });
                if (team == null) {
                    return res.status(400).send({
                        reason: 'team_not_exists'
                    });
                }
                else if (user == null) {
                    return res.status(400).send({
                        reason: 'user_not_exists'
                    });
                }
                user.team = team;
                yield userRepo.save(user);
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
}
exports.TeamController = TeamController;
//# sourceMappingURL=TeamController.js.map