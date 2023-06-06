import express from "express";
import validator from "validator";
import {AppDataSource} from "../../database/DatabaseProvider";
import {Group} from "../models/Group";
import {User} from "../models/User";
import {UserService} from "../services/UserService";
import {AuthenticationResources} from "../../resources/AuthenticationResources";

export class GroupController {

    groupRepo = AppDataSource.getRepository(Group);
    userRepo = AppDataSource.getRepository(User);

    async GetGroup(req: express.Request, res: express.Response) {

        if (req.params.group_id == null || !validator.isNumeric(req.params.group_id.toString())) {
            return res.status(400).send({
                reason: 'validation_error'
            });
        }

        if (!await UserService.hasPermission(res.locals.user_id, 'groups', false)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        try {
            const group = await this.groupRepo.findOneBy({id: +req.params.group_id});
            if (group != null) {
                res.status(200).send(group);
            } else {
                res.status(404).end();
            }
        } catch (e) {
            res.status(500).end();
        }

    }

    async GetGroups(req: express.Request, res: express.Response) {

        if (!await UserService.hasPermission(res.locals.user_id, 'groups', false)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        try {
            const groups = await this.groupRepo.find();
            res.status(200).send(groups);
        } catch (e) {
            res.status(500).end();
        }

    }

    async PostGroup(req: express.Request, res: express.Response) {

        if (req.body.name == null || !validator.isAlphanumeric(req.body.name)) {
            return res.status(400).send({
                reason: 'validation_error'
            });
        }

        if (!await UserService.hasPermission(res.locals.user_id, 'groups', true)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        const group = new Group();
        group.name = req.body.name;

        try {
            await this.groupRepo.save(group);
            res.status(200).end();
        } catch (e) {
            res.status(500).end();
        }

    }

    async PutGroup(req: express.Request, res: express.Response) {

        if (req.body.group_id == null || req.body.name == null
            || !validator.isAlphanumeric(req.body.name)
            || !validator.isNumeric(req.body.group_id.toString())) {
            return res.status(400).send({
                reason: 'validation_error'
            });
        }

        if (!await UserService.hasPermission(res.locals.user_id, 'groups', true)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        try {
            const group = await this.groupRepo.findOneBy({id: req.body.group_id});
            group.name = req.body.name;
            await this.groupRepo.save(group);
            res.status(200).end();
        } catch (e) {
            res.status(500).end();
        }

    }

    async DelGroup(req: express.Request, res: express.Response) {

        if (req.params.group_id == null || !validator.isNumeric(req.params.group_id.toString())) {
            return res.status(400).send({
                reason: 'validation_error'
            });
        }

        if (!await UserService.hasPermission(res.locals.user_id, 'groups', true)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        try {
            await this.groupRepo.delete({id: +req.params.group_id});
            res.status(200).end();
        } catch (e) {
            res.status(500).end();
        }

    }

    async PutSetUser(req: express.Request, res: express.Response) {

        if (req.body.group_id == null || req.body.user_id == null
            || !validator.isNumeric(req.body.user_id.toString())
            || !validator.isNumeric(req.body.group_id.toString())) {
            return res.status(400).send({
                reason: 'validation_error'
            });
        }

        if (!await UserService.hasPermission(res.locals.user_id, 'users', true)) {
            return res.status(403).send(AuthenticationResources.PermissionDenied);
        }

        try {
            const group = await this.groupRepo.findOneBy({id: req.body.group_id});
            const user = await this.userRepo.findOneBy({id: req.body.user_id});

            if (group == null) {
                return res.status(400).send({
                    reason: 'group_not_exists'
                });
            } else if (user == null) {
                return res.status(400).send({
                    reason: 'user_not_exists'
                });
            }

            user.group = group;
            await this.userRepo.save(user);
            res.status(200).end();
        } catch (e) {
            res.status(500).end();
        }

    }

}
