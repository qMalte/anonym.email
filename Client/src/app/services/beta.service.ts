import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {HttpService} from "./http.service";

@Injectable()
export class BetaService {

  constructor(private http: HttpClient, private httpService: HttpService) {
    //
  }

  async getState(): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http
        .get(`${environment.apiUrl}/beta`)
        .subscribe((response: any) => resolve(response.state), error => {
          this.httpService.displayError(error);
          resolve(false);
        });
    });
  }

  async checkCode(displayError = true): Promise<boolean> {
    return new Promise<boolean>(resolve => {
      this.http
        .get(`${environment.apiUrl}/beta/test`, this.httpService.getHttpOptions())
        .subscribe((response: any) => resolve(response.state), error => {
          if (displayError) {
            this.httpService.displayError(error);
          }
          resolve(false);
        });
    });
  }

}
