import { Component } from '@angular/core';
import {HelpModalService} from "./help-modal.service";

@Component({
  selector: 'app-help-modal',
  templateUrl: './help-modal.component.html',
  styleUrls: ['./help-modal.component.scss']
})
export class HelpModalComponent {

  constructor(public service: HelpModalService) {
    //
  }

}
