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
exports.PermissionController = void 0;
const validator_1 = __importDefault(require("validator"));
const UserService_1 = require("../services/UserService");
const DatabaseProvider_1 = require("../../database/DatabaseProvider");
const User_1 = require("../models/User");
const Group_1 = require("../models/Group");
const PermissionAssignment_1 = require("../models/PermissionAssignment");
const Permission_1 = require("../models/Permission");
const AuthenticationResources_1 = require("../../resources/AuthenticationResources");
class PermissionController {
    GetPermissionsByUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.user_id == null) {
                return res.status(400).send({
                    reason: 'validation_error:user_id:required'
                });
            }
            if (!validator_1.default.isNumeric(req.params.user_id)) {
                return res.status(400).send({
                    reason: 'validation_error:user_id:required'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'permissions', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const user = yield userRepo.findOneBy({
                id: +req.params.user_id
            });
            const permissionAssignmentsUser = yield UserService_1.UserService.getPermissionAssignmentsByUser(user);
            return res.status(200).send(permissionAssignmentsUser);
        });
    }
    GetPermissionsByGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.params.group_id == null) {
                return res.status(400).send({
                    reason: 'validation_error:group_id:required'
                });
            }
            if (!validator_1.default.isNumeric(req.params.group_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error:group_id:numeric'
                });
            }
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'permissions', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            const groupRepo = DatabaseProvider_1.AppDataSource.getRepository(Group_1.Group);
            const group = yield groupRepo.findOneBy({
                id: +req.params.group_id
            });
            const permissionAssignmentsUser = yield UserService_1.UserService.getPermissionAssignmentsByGroup(group);
            return res.status(200).send(permissionAssignmentsUser);
        });
    }
    GetPermissions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'permissions', false))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            const permissions = yield UserService_1.UserService.getPermissions();
            return res.status(200).send(permissions);
        });
    }
    PostPermissionUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'permissions', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            if (!validator_1.default.isNumeric(req.body.user_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error:user_id'
                });
            }
            if (!validator_1.default.isNumeric(req.body.permission_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error:permission_id'
                });
            }
            if (!validator_1.default.isBoolean(req.body.writeable.toString())) {
                return res.status(400).send({
                    reason: 'validation_error:writeable'
                });
            }
            const userRepo = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
            const permissionRepo = DatabaseProvider_1.AppDataSource.getRepository(Permission_1.Permission);
            const user = yield userRepo.findOneBy({ id: req.body.user_id });
            if (user == null) {
                return res.status(400).send({
                    reason: 'user_not_found'
                });
            }
            const permission = yield permissionRepo.findOneBy({ id: req.body.permission_id });
            if (permission == null) {
                return res.status(400).send({
                    reason: 'permission_not_found'
                });
            }
            const permissionAssignmentsRepo = DatabaseProvider_1.AppDataSource.getRepository(PermissionAssignment_1.PermissionAssignment);
            if (yield UserService_1.UserService.hasPermission(user.id, permission.identifier, req.body.writeable)) {
                return res.status(400).send({
                    reason: 'permission_already_set'
                });
            }
            else if (yield UserService_1.UserService.hasPermission(user.id, permission.identifier, false)) {
                const perm = yield permissionAssignmentsRepo.findOneBy({
                    user_id: user.id,
                    permission_id: permission.id
                });
                if (perm == null) {
                    return res.status(500).send({
                        reason: 'server_error:permission_set'
                    });
                }
                perm.writeable = req.body.writeable;
                yield perm.save();
            }
            else {
                const assignment = new PermissionAssignment_1.PermissionAssignment();
                assignment.user_id = user.id;
                assignment.permission_id = permission.id;
                assignment.writeable = req.body.writeable;
                yield permissionAssignmentsRepo.save(assignment);
            }
            return res.status(200).end();
        });
    }
    PostPermissionGroup(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.group_id, 'permissions', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            if (!validator_1.default.isNumeric(req.body.group_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error:group_id'
                });
            }
            if (!validator_1.default.isNumeric(req.body.permission_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error:permission_id'
                });
            }
            if (!validator_1.default.isBoolean(req.body.readable.toString())) {
                return res.status(400).send({
                    reason: 'validation_error:readable'
                });
            }
            if (!validator_1.default.isBoolean(req.body.writeable.toString())) {
                return res.status(400).send({
                    reason: 'validation_error:writeable'
                });
            }
            const groupRepo = DatabaseProvider_1.AppDataSource.getRepository(Group_1.Group);
            const permissionRepo = DatabaseProvider_1.AppDataSource.getRepository(Permission_1.Permission);
            const group = yield groupRepo.findOneBy({ id: req.body.group_id });
            if (group == null) {
                return res.status(400).send({
                    reason: 'group_not_found'
                });
            }
            const permission = yield permissionRepo.findOneBy({ id: req.body.permission_id });
            if (permission == null) {
                return res.status(400).send({
                    reason: 'permission_not_found'
                });
            }
            const permissionAssignmentsRepo = DatabaseProvider_1.AppDataSource.getRepository(PermissionAssignment_1.PermissionAssignment);
            if (yield UserService_1.UserService.hasPermission(group.id, permission.identifier, req.body.writeable)) {
                return res.status(400).send({
                    reason: 'permission_already_set'
                });
            }
            else if (yield UserService_1.UserService.hasPermission(group.id, permission.identifier, false)) {
                const perm = yield permissionAssignmentsRepo.findOneBy({
                    group_id: group.id,
                    permission_id: permission.id
                });
                if (perm == null) {
                    return res.status(500).send({
                        reason: 'server_error:permission_set'
                    });
                }
                perm.writeable = req.body.writeable;
                yield perm.save();
            }
            else {
                const assignment = new PermissionAssignment_1.PermissionAssignment();
                assignment.group_id = group.id;
                assignment.permission_id = permission.id;
                assignment.writeable = req.body.writeable;
                yield permissionAssignmentsRepo.save(assignment);
            }
            return res.status(200).end();
        });
    }
    DeletePermissionAssignment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!(yield UserService_1.UserService.hasPermission(res.locals.user_id, 'permissions', true))) {
                return res.status(403).send(AuthenticationResources_1.AuthenticationResources.PermissionDenied);
            }
            if (!validator_1.default.isNumeric(req.params.assignment_id.toString())) {
                return res.status(400).send({
                    reason: 'validation_error:permission_id'
                });
            }
            const permissionAssignmentsRepo = DatabaseProvider_1.AppDataSource.getRepository(PermissionAssignment_1.PermissionAssignment);
            const permission = yield permissionAssignmentsRepo.findOneBy({ id: +req.params.assignment_id });
            if (permission == null) {
                return res.status(400).send({
                    reason: 'permission_assignment_empty'
                });
            }
            yield permissionAssignmentsRepo.delete({
                id: +req.params.assignment_id
            });
            return res.status(200).end();
        });
    }
}
exports.PermissionController = PermissionController;
//# sourceMappingURL=PermissionController.js.map