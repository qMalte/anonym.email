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
exports.GameServerController = void 0;
const validator_1 = __importDefault(require("validator"));
const UserService_1 = require("../services/UserService");
const AuthenticationResources_1 = require("../../resources/AuthenticationResources");
const ValidationResources_1 = require("../../resources/ValidationResources");
const EntityRegistry_1 = require("../../database/EntityRegistry");
const Gameserver_1 = require("../models/Gameserver");
const GameserverControlHelper_1 = require("../services/GameServer/GameserverControlHelper");
const RemoteService_1 = require("../services/GameServer/RCON/RemoteService");
class GameServerController {
    GetServer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id == null || !validator_1.default.isNumeric(req.params.id.toString())) {
                return res.status(400).send(ValidationResources_1.ValidationResources.GameServerControllerMissingServerId);
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'gameServer_manage', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const server = yield EntityRegistry_1.EntityRegistry.getInstance().GameServer.findOneBy({ id: +req.params.id });
                if (server != null) {
                    res.status(200).send(server);
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
    GetServers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'gameServer_manage', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const server = yield EntityRegistry_1.EntityRegistry.getInstance().GameServer.find();
                res.status(200).send(server);
            }
            catch (e) {
                console.log(e);
                res.status(500).end();
            }
        });
    }
    PostServer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body == null) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'gameServer_manage', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const server = Object.assign(new Gameserver_1.GameServer(), req.body);
                yield server.save();
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PutServer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body == null) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'gameServer_manage', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const server = Object.assign(new Gameserver_1.GameServer(), req.body);
                yield server.save();
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    DelServer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id == null || !validator_1.default.isNumeric(req.params.id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'gameServer_manage', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                yield EntityRegistry_1.EntityRegistry.getInstance().GameServer.delete({ id: +req.params.id });
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    GetState(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id == null || !validator_1.default.isNumeric(req.params.id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'gameServer_manage', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const gs = yield EntityRegistry_1.EntityRegistry.getInstance().GameServer.findOneBy({ id: +req.params.id });
                const state = yield RemoteService_1.RemoteService.getInstance().isOnline(gs);
                res.status(200).send({ state });
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    GetDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.id == null || !validator_1.default.isNumeric(req.params.id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'gameServer_manage', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const gs = yield EntityRegistry_1.EntityRegistry.getInstance().GameServer.findOneBy({ id: +req.params.id });
                const details = yield GameserverControlHelper_1.GameServerControlHelper.getInstance().getServerDetails(gs);
                res.status(200).send(details);
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PostStart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.id == null || !validator_1.default.isNumeric(req.body.id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'gameServer_manage', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const gs = yield EntityRegistry_1.EntityRegistry.getInstance().GameServer.findOneBy({ id: +req.body.id });
                const result = yield GameserverControlHelper_1.GameServerControlHelper.getInstance().start(gs);
                if (result) {
                    res.status(200).end();
                }
                else {
                    res.status(500).end();
                }
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PostRestart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.id == null || !validator_1.default.isNumeric(req.body.id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'gameServer_manage', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const gs = yield EntityRegistry_1.EntityRegistry.getInstance().GameServer.findOneBy({ id: +req.body.id });
                const result = yield GameserverControlHelper_1.GameServerControlHelper.getInstance().restart(gs);
                if (result) {
                    res.status(200).end();
                }
                else {
                    res.status(500).end();
                }
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PostStop(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.id == null || !validator_1.default.isNumeric(req.body.id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'gameServer_manage', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const gs = yield EntityRegistry_1.EntityRegistry.getInstance().GameServer.findOneBy({ id: +req.body.id });
                const result = yield GameserverControlHelper_1.GameServerControlHelper.getInstance().stop(gs);
                if (result) {
                    res.status(200).end();
                }
                else {
                    res.status(500).end();
                }
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
}
exports.GameServerController = GameServerController;
//# sourceMappingURL=GameserverController.js.map