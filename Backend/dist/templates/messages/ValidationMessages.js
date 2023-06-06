"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationMessages = void 0;
class ValidationMessages {
}
exports.ValidationMessages = ValidationMessages;
ValidationMessages.templates = [
    {
        // Empty Username
        id: 1,
        message: 'Die Angabe des Benutzernamens oder der E-Mail ist erforderlich!'
    },
    {
        // Empty Password
        id: 2,
        message: 'Die Angabe des Passwortes ist erforderlich!'
    },
    {
        // Bad E-Mail
        id: 3,
        message: 'Es handelt sich bei der Eingabe ($1) um keine gültige E-Mail!'
    },
];
//# sourceMappingURL=ValidationMessages.js.map