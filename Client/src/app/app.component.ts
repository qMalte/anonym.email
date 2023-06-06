import {Component, OnInit} from '@angular/core';
import {BetaService} from "./services/beta.service";
import {BetaModalService} from "./beta-modal/beta-modal.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'anonym.email-client';

  constructor(private betaService: BetaService, private betaModalService: BetaModalService) {
    //
  }

  async ngOnInit() {
    if (await this.betaService.getState() && !(await this.betaService.checkCode(false))) {
      this.betaModalService.visibility = true;
    }
  }

}
