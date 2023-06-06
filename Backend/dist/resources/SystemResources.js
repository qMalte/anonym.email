"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemResources = void 0;
const Response_1 = require("../app/models/Response");
exports.SystemResources = {
    Hello: new Response_1.Response('hello_message', 'Die Anwendung ist bereit.', 'The application is ready.', []),
    ServerError: new Response_1.Response('general_server_error', 'Es ist ein Server Fehler aufgetreten, bitte später erneut versuchen oder den Support kontaktieren.', 'A server error has occurred, please try again later or contact support.', []),
};
//# sourceMappingURL=SystemResources.js.map