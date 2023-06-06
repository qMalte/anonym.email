import {UserController} from "./UserController";
import {GroupController} from "./GroupController";
import {PermissionController} from "./PermissionController";
import {TestController} from "./TestController";
import {AuthController} from "./AuthController";
import {EncryptionController} from "./EncryptionController";
import {MailAliasController} from "./MailAliasController";

export const ControllerRegistry = {
    User: new UserController(),
    Group: new GroupController(),
    Permission: new PermissionController(),
    Test: new TestController(),
    Auth: new AuthController(),
    Encryption: new EncryptionController(),
    MailAlias: new MailAliasController()
};
