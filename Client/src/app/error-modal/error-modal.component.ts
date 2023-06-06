import {Component, OnInit} from '@angular/core';
import {ErrorModalService} from "./error-modal.service";
import {HttpService} from "../services/http.service";

@Component({
  selector: 'app-error-modal',
  templateUrl: './error-modal.component.html',
  styleUrls: ['./error-modal.component.scss']
})
export class ErrorModalComponent {

  constructor(public service: ErrorModalService, private httpService: HttpService) {
    setInterval(async () => {;
      this.service.visibility = !await this.httpService.testConnection();
    }, 4000);
  }

}
