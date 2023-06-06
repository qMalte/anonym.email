"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
exports.Validation = void 0;
const Response_1 = require("../app/models/Response");
exports.Validation = {
    EmptyLogin: new Response_1.Response('validation_failed_login', 'Die Validierung des Logins ist fehlgeschalgen, es wird ein gültiger Benutzername oder eine E-Mail benötigt.', 'Login validation failed, a valid username or email is required.', ['login']),
    EmptyPassword: new Response_1.Response('validation_failed_password', 'Die Validierung des Passworts für den Login ist fehlgeschalgen, es wird ein gültiges Passwort benötigt.', 'The validation of the password for the login failed, a valid password is required.', ['password']),
    EmptyPassword: new Response_1.Response('validation_otp', 'Die Validierung des OTP ist fehlgeschalgen.', 'The validation of the password for the login failed, a valid password is required.', ['password']),
};
//# sourceMappingURL=ValidationResources.js.map
