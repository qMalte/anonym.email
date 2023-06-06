import {Response} from "../app/models/Response";

export const AuthenticationResources = {
    BadCredentials: new Response(
        'bad_login_credentials',
        'Die Zugangsdaten sind fehlerhaft.',
        'The access data is incorrect.',
        ['login', 'password']
    ),
    BadOtp: new Response(
        'bad_otp_token',
        'Die Zwei-Faktor-Authentifizierung ist fehlgeschalgen, bitte den OTP überprüfen.',
        'The two-factor authentication has failed, please check the OTP.',
        ['token']
    ),
    FailedPasswordReset: new Response(
        'failed_password_reset',
        'Das neue Passwort konnte nicht zurückgesezt werden.',
        'The new password could not be reset.',
        []
    ),
    RegistrationDisabled: new Response(
        'disabled_register',
        'Die Registrierung ist deaktiviert.',
        'Registration is disabled.',
        []
    ),
    PermissionDenied: new Response(
        'permission_denied',
        'Die Berechtigungen dieses Accounts reichen für diese Aktion nicht aus.',
        'The permissions of this account are not sufficient for this action.',
        []
    ),
    EmptyBetaToken: new Response(
        'empty_beta_token',
        'Der Beta-Token im Header der Anfrage wurde nicht erkannt.',
        'The beta token in the request header was not recognized.',
        ['X-Beta-Token']
    ),
    IncorrectBetaToken: new Response(
        'incorrect_beta_token',
        'Der Beta-Token ist nicht korrekt.',
        'The beta token is not correct.',
        ['X-Beta-Token']
    ),
}
