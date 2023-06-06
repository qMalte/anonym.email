"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
exports.default = {
    client: 'mysql',
    connection: {
        host: process.env.MYSQL_HOSTNAME,
        port: 3306,
        user: process.env.MYSQL_USERNAME,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DATABASE
    },
    pool: { min: 0, max: 8 },
    migrations: {
        directory: './database/migrations'
    },
    seeds: {
        directory: './database/seeds'
    }
};
//# sourceMappingURL=knexfile.js.map