import "reflect-metadata"
import {DataSource} from "typeorm"
import dotenv from "dotenv";
import {User} from "../app/models/User";
import {Session} from "../app/models/Session";
import {PasswordResetLink} from "../app/models/PasswordResetLink";
import {BlacklistedIP} from "../app/models/BlacklistedIP";
import {FailedLogin} from "../app/models/FailedLogin";
import {Permission} from "../app/models/Permission";
import {Group} from "../app/models/Group";
import {PermissionAssignment} from "../app/models/PermissionAssignment";
import {MailChangeRequest} from "../app/models/MailChangeRequest";
import {Log} from "../app/models/Log";
import {MailAlias} from "../app/models/MailAlias";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOSTNAME,
    port: 3306,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        Permission,
        User,
        Session,
        PasswordResetLink,
        BlacklistedIP,
        FailedLogin,
        Group,
        PermissionAssignment,
        MailChangeRequest,
        Log,
        MailAlias
    ],
    subscribers: [],
    migrations: []
})
