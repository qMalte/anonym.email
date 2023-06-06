import express from "express";
import validator from "validator";
import {UserService} from "../services/UserService";
import {AppDataSource} from "../../database/DatabaseProvider";
import {User} from "../models/User";
import {Group} from "../models/Group";
import {PermissionAssignment} from "../models/PermissionAssignment";
import {Permission} from "../models/Permission";
import {AuthenticationResources} from "../../resources/AuthenticationResources";

export class PermissionController {

    async GetPermissionsByUser(req: express.Request, res: express.Response) {

        if (req.params.user_id == null) {
            return res.status(400).send({
                reason: 'validation_error:user_id:required'
            });
        }

        if (!validator.isNumeric(req.params.user_id)) {
            return res.status(400).send({
                reason: 'validation_error:user_id:required'
            });
        }

        if (!await UserService.hasPermission(res.locals.user_id, 'permissions', false)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        const userRepo = AppDataSource.getRepository(User);
        const user = await userRepo.findOneBy({
            id: +req.params.user_id
        });

        const permissionAssignmentsUser = await UserService.getPermissionAssignmentsByUser(user);

        return res.status(200).send(permissionAssignmentsUser)

    }

    async GetPermissionsByGroup(req: express.Request, res: express.Response) {

        if (req.params.group_id == null) {
            return res.status(400).send({
                reason: 'validation_error:group_id:required'
            });
        }

        if (!validator.isNumeric(req.params.group_id.toString())) {
            return res.status(400).send({
                reason: 'validation_error:group_id:numeric'
            });
        }

        if (!await UserService.hasPermission(res.locals.user_id, 'permissions', false)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        const groupRepo = AppDataSource.getRepository(Group);
        const group = await groupRepo.findOneBy({
            id: +req.params.group_id
        });

        const permissionAssignmentsUser = await UserService.getPermissionAssignmentsByGroup(group);

        return res.status(200).send(permissionAssignmentsUser);

    }

    async GetPermissions(req: express.Request, res: express.Response) {

        if (!await UserService.hasPermission(res.locals.user_id, 'permissions', false)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        const permissions = await UserService.getPermissions();

        return res.status(200).send(permissions);

    }

    async PostPermissionUser(req: express.Request, res: express.Response) {

        if (!await UserService.hasPermission(res.locals.user_id, 'permissions', true)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        if (!validator.isNumeric(req.body.user_id.toString())) {
            return res.status(400).send({
                reason: 'validation_error:user_id'
            });
        }

        if (!validator.isNumeric(req.body.permission_id.toString())) {
            return res.status(400).send({
                reason: 'validation_error:permission_id'
            });
        }

        if (!validator.isBoolean(req.body.writeable.toString())) {
            return res.status(400).send({
                reason: 'validation_error:writeable'
            });
        }

        const userRepo = AppDataSource.getRepository(User);
        const permissionRepo = AppDataSource.getRepository(Permission);

        const user = await userRepo.findOneBy({id: req.body.user_id});
        if (user == null) {
            return res.status(400).send({
                reason: 'user_not_found'
            });
        }

        const permission = await permissionRepo.findOneBy({id: req.body.permission_id});
        if (permission == null) {
            return res.status(400).send({
                reason: 'permission_not_found'
            });
        }

        const permissionAssignmentsRepo = AppDataSource.getRepository(PermissionAssignment);

        if (await UserService.hasPermission(user.id, permission.identifier, req.body.writeable)) {
            return res.status(400).send({
                reason: 'permission_already_set'
            });
        } else if (await UserService.hasPermission(user.id, permission.identifier, false)) {
            const perm = await permissionAssignmentsRepo.findOneBy({
                user_id: user.id,
                permission_id: permission.id
            });

            if (perm == null) {
                return res.status(500).send({
                    reason: 'server_error:permission_set'
                });
            }

            perm.writeable = req.body.writeable;
            await perm.save();
        } else {
            const assignment = new PermissionAssignment();
            assignment.user_id = user.id;
            assignment.permission_id = permission.id;
            assignment.writeable = req.body.writeable;
            await permissionAssignmentsRepo.save(assignment);
        }

        return res.status(200).end();
    }

    async PostPermissionGroup(req: express.Request, res: express.Response) {

        if (!await UserService.hasPermission(res.locals.group_id, 'permissions', true)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        if (!validator.isNumeric(req.body.group_id.toString())) {
            return res.status(400).send({
                reason: 'validation_error:group_id'
            });
        }

        if (!validator.isNumeric(req.body.permission_id.toString())) {
            return res.status(400).send({
                reason: 'validation_error:permission_id'
            });
        }

        if (!validator.isBoolean(req.body.readable.toString())) {
            return res.status(400).send({
                reason: 'validation_error:readable'
            });
        }

        if (!validator.isBoolean(req.body.writeable.toString())) {
            return res.status(400).send({
                reason: 'validation_error:writeable'
            });
        }

        const groupRepo = AppDataSource.getRepository(Group);
        const permissionRepo = AppDataSource.getRepository(Permission);

        const group = await groupRepo.findOneBy({id: req.body.group_id});
        if (group == null) {
            return res.status(400).send({
                reason: 'group_not_found'
            });
        }

        const permission = await permissionRepo.findOneBy({id: req.body.permission_id});
        if (permission == null) {
            return res.status(400).send({
                reason: 'permission_not_found'
            });
        }

        const permissionAssignmentsRepo = AppDataSource.getRepository(PermissionAssignment);

        if (await UserService.hasPermission(group.id, permission.identifier, req.body.writeable)) {
            return res.status(400).send({
                reason: 'permission_already_set'
            });
        } else if (await UserService.hasPermission(group.id, permission.identifier, false)) {
            const perm = await permissionAssignmentsRepo.findOneBy({
                group_id: group.id,
                permission_id: permission.id
            });

            if (perm == null) {
                return res.status(500).send({
                    reason: 'server_error:permission_set'
                });
            }

            perm.writeable = req.body.writeable;
            await perm.save();
        } else {
            const assignment = new PermissionAssignment();
            assignment.group_id = group.id;
            assignment.permission_id = permission.id;
            assignment.writeable = req.body.writeable;
            await permissionAssignmentsRepo.save(assignment);
        }

        return res.status(200).end();

    }

    async DeletePermissionAssignment(req: express.Request, res: express.Response) {

        if (!await UserService.hasPermission(res.locals.user_id, 'permissions', true)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        if (!validator.isNumeric(req.params.assignment_id.toString())) {
            return res.status(400).send({
                reason: 'validation_error:permission_id'
            });
        }

        const permissionAssignmentsRepo = AppDataSource.getRepository(PermissionAssignment);

        const permission = await permissionAssignmentsRepo.findOneBy({id: +req.params.assignment_id});
        if (permission == null) {
            return res.status(400).send({
                reason: 'permission_assignment_empty'
            });
        }

        await permissionAssignmentsRepo.delete({
            id: +req.params.assignment_id
        });

        return res.status(200).end();

    }

}
