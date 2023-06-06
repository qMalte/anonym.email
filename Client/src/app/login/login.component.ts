import {Component, OnInit} from '@angular/core';
import {AuthService} from "com.malte.angular-client-sdk";
import {AlertModalService} from "../alert-modal/alert-modal.service";
import {Router} from "@angular/router";
import {LoaderService} from "../loader/loader.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  showPasswordField = false;
  showSecurityCodeField = false;

  email: string = '';
  password: string = '';
  securityCode: string = '';
  pw1: string = '';
  pw2: string = '';

  constructor(private authService: AuthService, private alertService: AlertModalService, private router: Router,
              private loaderService: LoaderService) {
    //
  }

  async ngOnInit() {
    this.loaderService.visibility = true;
    if (await this.authService.isAuth()) {
      await this.router.navigate(['/account']);
    }
    this.loaderService.visibility = false;
  }

  passwordButtonClick() {

    if (this.email == null || this.email == '') {
      this.alertService.show('Bitte geben eine gültige E-Mail-Adresse ein.');
      return;
    }

    this.showPasswordField = true;
    this.showSecurityCodeField = false;
  }

  async securityCodeButtonClick() {
    this.loaderService.visibility = true;

    if (this.email == null || this.email == '') {
      this.alertService.show('Bitte geben eine gültige E-Mail-Adresse ein.');
      return;
    }

    if (await this.authService.passwordResetRequest(this.email)) {
      this.showPasswordField = false;
      this.showSecurityCodeField = true;
    } else {
      this.alertService.show('Fehler beim Zurücksetzen des Passworts. Bitte versuchen Sie es später erneut.');
    }

    this.loaderService.visibility = false;
  }

  async setPassword() {
    this.loaderService.visibility = true;

    if (this.email == null || this.email == '') {
      this.alertService.show('Bitte geben eine gültige E-Mail-Adresse ein.');
      return;
    }

    if (this.securityCode == null || this.securityCode == '') {
      this.alertService.show('Bitte geben ein gültiges Einmalpasswort ein.');
      return;
    }

    if (isNaN(+this.securityCode)) {
      this.alertService.show('Das Einmwalpasswort darf nur aus numerischen Zeichen bestehen.');
      return;
    }

    if (this.pw1 == null || this.pw1 == '') {
      this.alertService.show('Bitte geben ein gültiges Passwort ein.');
      return;
    }

    if (this.pw2 == null || this.pw2 == '') {
      this.alertService.show('Bitte gebe zur Bestätigung das Passwort erneut ein.');
      return;
    }

    if (this.pw1 != this.pw2) {
      this.alertService.show('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (await this.authService.passwordReset(this.email, +this.securityCode, this.pw1)) {
      if (await this.authService.login(this.email, this.pw1)) {
        this.successLogin().then();
        return;
      }
    }

    this.alertService.show('Fehler beim Zurücksetzen des Passworts.');

    this.loaderService.visibility = false;
  }

  async login() {
      this.loaderService.visibility = true;

      if (this.email == null || this.email == '') {
        this.alertService.show('Bitte geben eine gültige E-Mail-Adresse ein.');
        return;
      }

      if (this.password == null || this.password == '') {
        this.alertService.show('Bitte geben ein gültiges Passwort ein.');
        return;
      }

      if (await this.authService.login(this.email, this.password)) {
        this.successLogin().then();
        return;
      }

      this.alertService.show('Mit diesen Zugangsdaten ist keine Anmeldung möglich.');

      this.loaderService.visibility = false;
  }

  async successLogin() {
    this.showPasswordField = false;
    this.showSecurityCodeField = false;
    await this.router.navigate(['/account']);
  }

  cancelButtonClick() {
    this.showPasswordField = false;
    this.showSecurityCodeField = false;
  }

}
