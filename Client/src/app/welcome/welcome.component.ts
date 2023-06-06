import { Component } from '@angular/core';
import {HelpModalService} from "../help-modal/help-modal.service";
import {MailAliasService} from "../services/mailAlias.service";
import {MailModalService} from "../mail-modal/mail-modal.service";

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent {

  email: string = '';
  constructor(public helpModal: HelpModalService, private mailAliasService: MailAliasService,
              private mailModalService: MailModalService) {

  }

  async submit() {
    const alias = await this.mailAliasService.addAlias(this.email);
    if (alias != null) {
      this.mailModalService.email = alias?.mailbox + '@anonym.email';
      this.mailModalService.visibility = true;
      this.email = '';
    }
  }

}
