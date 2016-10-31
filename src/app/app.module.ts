import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { PtsNotifyComponent } from './components/pts-notify/pts-notify.component';
import { AppComponent } from './components/app/app.component';
import { PtsLoginComponent } from './components/pts-login/pts-login.component';
import { PtsToolbarComponent } from './components/pts-toolbar/pts-toolbar.component';

import { AuthService } from "./services/auth.service";
import { StorageService } from "./services/storage.service";


@NgModule({
  declarations: [
    PtsNotifyComponent,
    AppComponent,
    PtsLoginComponent,
    PtsToolbarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    AuthService,
    StorageService
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
