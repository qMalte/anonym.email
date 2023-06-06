"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../app/models/User");
const Session_1 = require("../app/models/Session");
const PasswordResetLink_1 = require("../app/models/PasswordResetLink");
const BlacklistedIP_1 = require("../app/models/BlacklistedIP");
const FailedLogin_1 = require("../app/models/FailedLogin");
const Permission_1 = require("../app/models/Permission");
const Group_1 = require("../app/models/Group");
const PermissionAssignment_1 = require("../app/models/PermissionAssignment");
const MailChangeRequest_1 = require("../app/models/MailChangeRequest");
const Log_1 = require("../app/models/Log");
const MailAlias_1 = require("../app/models/MailAlias");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOSTNAME,
    port: 3306,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        Permission_1.Permission,
        User_1.User,
        Session_1.Session,
        PasswordResetLink_1.PasswordResetLink,
        BlacklistedIP_1.BlacklistedIP,
        FailedLogin_1.FailedLogin,
        Group_1.Group,
        PermissionAssignment_1.PermissionAssignment,
        MailChangeRequest_1.MailChangeRequest,
        Log_1.Log,
        MailAlias_1.MailAlias
    ],
    subscribers: [],
    migrations: []
});
//# sourceMappingURL=DatabaseProvider.js.map