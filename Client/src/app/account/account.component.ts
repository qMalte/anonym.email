import {Component, OnInit} from '@angular/core';
import {AuthService, PermissionService, PermissionType} from "com.malte.angular-client-sdk";
import {Router} from "@angular/router";
import {MailAlias} from "../models/MailAlias";
import {MailAliasService} from "../services/mailAlias.service";
import {User} from "com.malte.angular-client-sdk/lib/models/User";
import {LoaderService} from "../loader/loader.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

  user?: User | null;
  ownAliases: MailAlias[] = [];
  allAliases: MailAlias[] = [];

  adminPermission = false;
  adminView = false;

  constructor(private authService: AuthService, private router: Router, private mailAliasService: MailAliasService,
              private loaderService: LoaderService, private permissionService: PermissionService) {
  }

  async ngOnInit() {
    this.loaderService.visibility = true;
    if (!await this.authService.isAuth()) {
      await this.router.navigate(['/login']);
    }

    this.ownAliases = await this.mailAliasService.getAliases();
    this.user = await this.authService.getCurrentUserDetails();
    this.adminPermission = await this.permissionService.checkReadable(PermissionType.Aliases) || await this.permissionService.checkReadable(PermissionType.Administrator);

    if (this.adminPermission) {
      this.allAliases = await this.mailAliasService.getAliasesAsAdmin();
    }

    this.loaderService.visibility = false;
  }

  async logout() {
    this.loaderService.visibility = true;
    if (await this.authService.logout()) {
      await this.router.navigate(['/welcome']);
    }
    this.loaderService.visibility = false;
  }

  async deleteAlias(alias: MailAlias) {
    this.loaderService.visibility = true;
    let result: boolean;
    if (this.adminView) {
      result = await this.mailAliasService.deleteAliasAsAdmin(alias);
    } else {
      result = await this.mailAliasService.deleteAlias(alias);
    }
    if (result) {
      const indexOwn = this.ownAliases.indexOf(alias);
      this.ownAliases.splice(indexOwn, 1);
      const indexAll = this.allAliases.indexOf(alias);
      this.allAliases.splice(indexAll, 1);
    }
    this.loaderService.visibility = false;
  }

}
