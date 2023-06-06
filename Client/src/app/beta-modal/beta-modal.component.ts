import { Component } from '@angular/core';
import {BetaModalService} from "./beta-modal.service";
import {CryptoService} from "com.malte.angular-client-sdk";
import {HttpService} from "../services/http.service";
import {BetaService} from "../services/beta.service";
import {AlertModalService} from "../alert-modal/alert-modal.service";

@Component({
  selector: 'app-beta-modal',
  templateUrl: './beta-modal.component.html',
  styleUrls: ['./beta-modal.component.scss']
})
export class BetaModalComponent {

  betaCode: string = "";

  constructor(public service: BetaModalService, private cryptoService: CryptoService,
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

}
