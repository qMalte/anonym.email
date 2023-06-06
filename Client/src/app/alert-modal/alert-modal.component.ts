import { Component } from '@angular/core';
import {AlertModalService} from "./alert-modal.service";

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.component.html',
  styleUrls: ['./alert-modal.component.scss']
})
export class AlertModalComponent {

  constructor(public service: AlertModalService) {
    //
  }

}
