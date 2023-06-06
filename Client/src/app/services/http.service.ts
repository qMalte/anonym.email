import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AlertModalService} from "../alert-modal/alert-modal.service";
import {environment} from "../../environments/environment";

@Injectable()
export class HttpService {

  options: HttpOptions = this.getHttpOptions();

  constructor(private alertService: AlertModalService, private http: HttpClient) {
    this.getHttpOptions();
  }

  getHttpOptions(): any {
    const betaKey = localStorage.getItem("betaKey");
    const sessionId = sessionStorage.getItem("sessionID");

    this.options = {
      headers: new HttpHeaders({
        'X-Beta-Token': betaKey == null ? "" : betaKey,
        Authorization: sessionId == null ? "" : sessionId,
      })
    };

    return this.options;
  }

  setBetaKey(betaKey: string): void {
    localStorage.setItem("betaKey", betaKey);
  }

  displayError(error: any): void {
    if (error != null && error.error != null && error.error.description_de != null) {
      this.alertService.show(error.error.description_de);
    }
  }

  async testConnection(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http
        .get(`${environment.apiUrl}/test`)
        .subscribe(() => resolve(true), () => resolve(false));
    });
  }

}

export interface HttpOptions {
  headers: HttpHeaders
}
