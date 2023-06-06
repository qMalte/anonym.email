import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {HttpService} from "./http.service";
import {environment} from "../../environments/environment";
import {MailAlias} from "../models/MailAlias";

@Injectable()
export class MailAliasService {

  constructor(private http: HttpClient, private httpService: HttpService) {
    //
  }

  addAlias(targetAddress: string) {
    this.httpService.getHttpOptions();
    return new Promise<MailAlias|null>(resolve => {
      this.http
        .post<MailAlias>(`${environment.apiUrl}/alias`, {
          email: targetAddress
        }, this.httpService.options)
        .subscribe(alias => resolve(alias), error => {
          this.httpService.displayError(error);
          resolve(null);
        });
    });
  }

  getAliases() {
    this.httpService.getHttpOptions();
    return new Promise<MailAlias[]>(resolve => {
      this.http
        .get<MailAlias[]>(`${environment.apiUrl}/aliases`, this.httpService.options)
        .subscribe(alias => resolve(alias), error => {
          this.httpService.displayError(error);
          resolve([]);
        });
    });
  }

  getAliasesAsAdmin() {
    this.httpService.getHttpOptions();
    return new Promise<MailAlias[]>(resolve => {
      this.http
        .get<MailAlias[]>(`${environment.apiUrl}/aliases/admin`, this.httpService.options)
        .subscribe(alias => resolve(alias), error => {
          this.httpService.displayError(error);
          resolve([]);
        });
    });
  }

  deleteAlias(alias: MailAlias) {
    this.httpService.getHttpOptions();
    return new Promise<boolean>(resolve => {
      this.http
        .delete(`${environment.apiUrl}/alias/${alias.id}`, this.httpService.options)
        .subscribe(alias => resolve(true), error => {
          this.httpService.displayError(error);
          resolve(false);
        });
    });
  }

  deleteAliasAsAdmin(alias: MailAlias) {
    this.httpService.getHttpOptions();
    return new Promise<boolean>(resolve => {
      this.http
        .delete(`${environment.apiUrl}/alias/${alias.id}/admin`, this.httpService.options)
        .subscribe(alias => resolve(true), error => {
          this.httpService.displayError(error);
          resolve(false);
        });
    });
  }

}
