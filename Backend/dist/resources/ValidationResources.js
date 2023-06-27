"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationResources = void 0;
const Response_1 = require("../app/models/Response");
exports.ValidationResources = {
    EmptyLogin: new Response_1.Response('validation_failed_login', 'Die Validierung des Logins ist fehlgeschalgen, es wird ein gültiger Benutzername oder eine E-Mail benötigt.', 'Login validation failed, a valid username or email is required.', ['login']),
    EmptyPassword: new Response_1.Response('validation_failed_password', 'Die Validierung des Passworts für den Login ist fehlgeschalgen, es wird ein gültiges Passwort benötigt.', 'The validation of the password for the login failed, a valid password is required.', ['password']),
    MissingOtpToken: new Response_1.Response('validation_otp', 'Die Validierung des OTP ist fehlgeschalgen.', 'The validation of the OTP has failed.', ['token']),
    MissingMailToResetPassword: new Response_1.Response('missing_mail_reset_password', 'Zum Passwort-Reset wird eine gültige mit dem Account verknüpfte Mail benötigt.', 'A valid mail associated with the account is required for password reset.', ['email']),
    MissingUserWithGivenMail: new Response_1.Response('missing_user_reset_password', 'Es wurde kein Account mit dieser E-Mail im System gefunden.', 'No account with this email was found in the system.', []),
    MissingDataPasswordReset: new Response_1.Response('missing_data_reset_password', 'Es wurden nicht alle erforderlichen Daten übermittelt, um das neue Passwort zu setzen.', 'Not all the required data has been submitted to set the new password.', ['email', 'code', 'passsword']),
    MailFormat: new Response_1.Response('bad_mail_format', 'Das Format der E-Mail konnte nicht validiert werden.', 'The format of the email could not be validated.', ['email']),
    MultipleMailFormat: new Response_1.Response('multiple_mail_use', 'Die E-Mail wird bereits verwendet.', 'The email is already in use.', ['email']),
    UsernameFormat: new Response_1.Response('bad_username_format', 'Das Format des Benutzernamens konnte nicht validiert werden.', 'The format of the username could not be validated.', ['username']),
    MultipleUsernameFormat: new Response_1.Response('multiple_username_use', 'Der Benutzername wird bereits verwendet.', 'The username is already in use.', ['username']),
    SecurityCode: new Response_1.Response('bad_securityCode_format', 'Das Format des Sicherheitscodes konnte nicht validiert werden.', 'The format of the security code could not be validated.', ['code']),
    RegisterData: new Response_1.Response('register_validation_failed', 'Für die Registrierung werden die folgenden Parameter benötigt.', 'The following parameters are required for registration.', ['email', 'username', 'password']),
    OtpCodeFormat: new Response_1.Response('otp_code_format', 'Das Format des OTP-Codes ist fehlerhaft.', 'The format of the OTP code is incorrect.', ['otpCode']),
    OtpEnableParams: new Response_1.Response('otp_enable_params', 'Um die Zwei-Faktor-Authentifizierung zu aktivieren, wird das aktuelle Passwort und der aktuelle OTP benötigt.', 'To enable two-factor authentication, the current password and OTP are required.', ['otpCode', 'password']),
    GameServerControllerMissingServerId: new Response_1.Response('validation_error_serverId', 'Um die Informationen eines bestimmten Servers zu erhalten, wird die eindeutige Server ID benötigt.', 'To get the information of a particular server, the unique server ID is needed.', ['id']),
    MissingMailAddressCreationInformation: new Response_1.Response('validation_error_mail_creation', 'Um einen neuen E-Mail Alias anzulegen, wird eine gültige E-Mail Adresse als eine Ziel-Adresse benötigt.', 'To create a new email alias, a valid email address is required as a destination address.', ['email']),
    MailAddressCouldNotValidated: new Response_1.Response('validation_error_email', 'Die E-Mail Adresse konnte nicht als gültige E-Mail Adresse validiert werden.', 'The email address could not be validated as a valid email address.', []),
    AliasNotFound: new Response_1.Response('validation_error_alias_not_found', 'Der Alias wurde nicht gefunden oder wurde bereits gelöscht.', 'The alias was not found or has already been deleted.', []),
    MailAddressLimitReached: new Response_1.Response('mail_address_limit_reached', 'Die maximale Anzahl an Alias-Adressen für dieses Ziel wurde erreicht.', 'The maximum number of alias addresses for this destination has been reached.', []),
    MissingMailAliasId: new Response_1.Response('mail_alias_id_empty', 'Die MailAlias ID ist leer.', 'The MailAlias ID is empty.', ['id']),
    MailAliasIdValidationFailed: new Response_1.Response('mail_alias_id_empty', 'Die Alias ID konnte nicht validiert werden.', 'The alias ID could not be validated.', ['id']),
    MissingMailAliasCustomName: new Response_1.Response('mail_alias_customName_empty', 'Der benutzerdefinierte Name sollte nicht leer sein.', 'The custom name should not be empty.', ['customName']),
    MailAliasCustomNameValidationFailed: new Response_1.Response('mail_alias_customName_empty', 'Der benutzerdefinierte Name konnte nicht validiert werden.', 'The custom name could not be validated.', ['customName']),
};
//# sourceMappingURL=ValidationResources.js.map