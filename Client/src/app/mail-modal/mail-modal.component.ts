import { Component } from '@angular/core';
import {MailModalService} from "./mail-modal.service";
import {CryptoService} from "com.malte.angular-client-sdk";
import {HttpService} from "../services/http.service";
import {BetaService} from "../services/beta.service";
import {AlertModalService} from "../alert-modal/alert-modal.service";

@Component({
  selector: 'app-mail-modal',
  templateUrl: './mail-modal.component.html',
  styleUrls: ['./mail-modal.component.scss']
})
export class MailModalComponent {

  betaCode: string = "";

  constructor(public service: MailModalService, private cryptoService: CryptoService,
              private httpService: HttpService, private betaService: BetaService,
              private alertService: AlertModalService) {
    //
  }

  async check() {
    if (this.betaCode == null || this.betaCode === '') {
      this.alertService.show("Bitte geben Sie einen Beta-Code ein.");
      return;
    }

    const encryptedKey = await this.cryptoService.encryptSingleValue(this.betaCode);
    this.httpService.setBetaKey(encryptedKey);

    if (await this.betaService.checkCode()) {
      this.service.visibility = false;
    }
  }

  fallbackCopyTextToClipboard(text: string) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      var successful = document.execCommand('copy');
      var msg = successful ? 'successful' : 'unsuccessful';
      console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
      console.error('Fallback: Oops, unable to copy', err);
    }

    document.body.removeChild(textArea);
  }

  copyTextToClipboard(text: string) {
    if (!navigator.clipboard) {
      this.fallbackCopyTextToClipboard(text);
      return;
    }
    navigator.clipboard.writeText(text).then(function() {
      console.log('Async: Copying to clipboard was successful!');
    }, function(err) {
      console.error('Async: Could not copy text: ', err);
    });
  }

}
