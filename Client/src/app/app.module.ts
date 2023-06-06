import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HelpModalComponent } from './help-modal/help-modal.component';
import {HelpModalService} from "./help-modal/help-modal.service";
import {ClientSdkModule} from "com.malte.angular-client-sdk";
import {environment} from "../environments/environment";
import {HttpClientModule} from "@angular/common/http";
import {BetaModalComponent} from "./beta-modal/beta-modal.component";
import {BetaModalService} from "./beta-modal/beta-modal.service";
import {AlertModalComponent} from "./alert-modal/alert-modal.component";
import {AlertModalService} from "./alert-modal/alert-modal.service";
import {HttpService} from "./services/http.service";
import {BetaService} from "./services/beta.service";
import {FormsModule} from "@angular/forms";
import {ErrorModalComponent} from "./error-modal/error-modal.component";
import {ErrorModalService} from "./error-modal/error-modal.service";
import {MailAliasService} from "./services/mailAlias.service";
import {MailModalComponent} from "./mail-modal/mail-modal.component";
import {MailModalService} from "./mail-modal/mail-modal.service";
import { LoginComponent } from './login/login.component';
import { AccountComponent } from './account/account.component';
import { LoaderComponent } from './loader/loader.component';
import {LoaderService} from "./loader/loader.service";

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HelpModalComponent,
    BetaModalComponent,
    AlertModalComponent,
    ErrorModalComponent,
    MailModalComponent,
    LoginComponent,
    AccountComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ClientSdkModule.forRoot(environment),
    HttpClientModule,
    FormsModule
  ],
  providers: [
    HelpModalService,
    BetaModalService,
    AlertModalService,
    HttpService,
    BetaService,
    ErrorModalService,
    MailAliasService,
    MailModalService,
    LoaderService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
