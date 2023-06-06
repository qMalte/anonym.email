"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Authentication = void 0;
const Response_1 = require("../app/models/Response");
exports.Authentication = {
    BadCredentials: new Response_1.Response('bad_login_credentials', 'Die Zugangsdaten sind fehlerhaft.', 'The access data is incorrect.', ['login', 'password']),
};
//# sourceMappingURL=AuthenticationResources.js.map
