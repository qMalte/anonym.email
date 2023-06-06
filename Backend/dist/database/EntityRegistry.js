"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityRegistry = void 0;
const DatabaseProvider_1 = require("./DatabaseProvider");
const BlacklistedIP_1 = require("../app/models/BlacklistedIP");
const FailedLogin_1 = require("../app/models/FailedLogin");
const Group_1 = require("../app/models/Group");
const Log_1 = require("../app/models/Log");
const MailChangeRequest_1 = require("../app/models/MailChangeRequest");
const PasswordResetLink_1 = require("../app/models/PasswordResetLink");
const Permission_1 = require("../app/models/Permission");
const PermissionAssignment_1 = require("../app/models/PermissionAssignment");
const Session_1 = require("../app/models/Session");
const User_1 = require("../app/models/User");
const MailAlias_1 = require("../app/models/MailAlias");
class EntityRegistry {
    constructor() {
        this.BlacklistedIP = DatabaseProvider_1.AppDataSource.getRepository(BlacklistedIP_1.BlacklistedIP);
        this.FailedLogin = DatabaseProvider_1.AppDataSource.getRepository(FailedLogin_1.FailedLogin);
        this.Group = DatabaseProvider_1.AppDataSource.getRepository(Group_1.Group);
        this.Log = DatabaseProvider_1.AppDataSource.getRepository(Log_1.Log);
        this.MailChangeRequest = DatabaseProvider_1.AppDataSource.getRepository(MailChangeRequest_1.MailChangeRequest);
        this.PasswordResetLink = DatabaseProvider_1.AppDataSource.getRepository(PasswordResetLink_1.PasswordResetLink);
        this.Permission = DatabaseProvider_1.AppDataSource.getRepository(Permission_1.Permission);
        this.PermissionAssignment = DatabaseProvider_1.AppDataSource.getRepository(PermissionAssignment_1.PermissionAssignment);
        this.Session = DatabaseProvider_1.AppDataSource.getRepository(Session_1.Session);
        this.User = DatabaseProvider_1.AppDataSource.getRepository(User_1.User);
        this.MailAlias = DatabaseProvider_1.AppDataSource.getRepository(MailAlias_1.MailAlias);
    }
    static getInstance() {
        if (this._Instance == null)
            this._Instance = new EntityRegistry();
        return this._Instance;
    }
}
exports.EntityRegistry = EntityRegistry;
//# sourceMappingURL=EntityRegistry.js.map