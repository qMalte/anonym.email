import {Injectable} from "@angular/core";

@Injectable()
export class AlertModalService {

  visibility = false;
  message = "";

  show(message: string, duration: number = 8000) {
    this.visibility = true;
    this.message = message;
    setTimeout(() => {
      this.visibility = false;
    }, duration);
  }

}
