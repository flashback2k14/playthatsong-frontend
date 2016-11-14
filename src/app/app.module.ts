import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from "./app.routing";

import { PtsNotifyComponent } from './components/pts-notify/pts-notify.component';
import { AppComponent } from './components/app/app.component';
import { PtsLoginComponent } from './components/pts-login/pts-login.component';
import { PtsRegisterComponent } from './components/pts-register/pts-register.component';
import { PtsToolbarComponent } from './components/pts-toolbar/pts-toolbar.component';
import { PtsContentComponent } from './components/pts-content/pts-content.component';
import { PtsContentAdminComponent } from './components/pts-content-admin/pts-content-admin.component';
import { PtsContentDeejayComponent } from './components/pts-content-deejay/pts-content-deejay.component';

import { AuthService } from "./services/auth.service";
import { StorageService } from "./services/storage.service";

import { AuthHelper } from "./helpers/auth.helper";


@NgModule({
  declarations: [
    PtsNotifyComponent,
    AppComponent,
    PtsLoginComponent,
    PtsRegisterComponent,
    PtsToolbarComponent,
    PtsContentComponent,
    PtsContentAdminComponent,
    PtsContentDeejayComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [
    AuthService,
    StorageService,
    AuthHelper
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
