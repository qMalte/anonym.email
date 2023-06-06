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
exports.GroupController = void 0;
const validator_1 = __importDefault(require("validator"));
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
const Group_1 = require("../models/Group");
const User_1 = require("../models/User");
const UserService_1 = require("../services/UserService");
const AuthenticationResources_1 = require("../../resources/AuthenticationResources");
class GroupController {
    constructor() {
        this.groupRepo = DatabaseProvider_1.AppDataSource.getRepository(Group_1.Group);
        this.userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
    }
    GetGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.group_id == null || !validator_1.default.isNumeric(req.params.group_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'groups', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const group = yield this.groupRepo.findOneBy({ id: +req.params.group_id });
                if (group != null) {
                    res.status(200).send(group);
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
    GetGroups(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'groups', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const groups = yield this.groupRepo.find();
                res.status(200).send(groups);
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PostGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.name == null || !validator_1.default.isAlphanumeric(req.body.name)) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'groups', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            const group = new Group_1.Group();
            group.name = req.body.name;
            try {
                yield this.groupRepo.save(group);
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PutGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.group_id == null || req.body.name == null
                || !validator_1.default.isAlphanumeric(req.body.name)
                || !validator_1.default.isNumeric(req.body.group_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'groups', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const group = yield this.groupRepo.findOneBy({ id: req.body.group_id });
                group.name = req.body.name;
                yield this.groupRepo.save(group);
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    DelGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.group_id == null || !validator_1.default.isNumeric(req.params.group_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'groups', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                yield this.groupRepo.delete({ id: +req.params.group_id });
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
    PutSetUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.body.group_id == null || req.body.user_id == null
                || !validator_1.default.isNumeric(req.body.user_id.toString())
                || !validator_1.default.isNumeric(req.body.group_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'users', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            try {
                const group = yield this.groupRepo.findOneBy({ id: req.body.group_id });
                const user = yield this.userRepo.findOneBy({ id: req.body.user_id });
                if (group == null) {
                    return res.status(400).send({
                        reason: 'group_not_exists'
                    });
                }
                else if (user == null) {
                    return res.status(400).send({
                        reason: 'user_not_exists'
                    });
                }
                user.group = group;
                yield this.userRepo.save(user);
                res.status(200).end();
            }
            catch (e) {
                res.status(500).end();
            }
        });
    }
}
exports.GroupController = GroupController;
//# sourceMappingURL=GroupController.js.map