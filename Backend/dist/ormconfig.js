"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
require("dotenv").config();
const config = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.MYSQL_HOSTNAME,
    port: 3306,
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    synchronize: true,
    logging: false,
    entities: [
        "app/models/*.ts"
    ],
    subscribers: [],
    migrations: []
});
exports.default = config;
//# sourceMappingURL=ormconfig.js.map