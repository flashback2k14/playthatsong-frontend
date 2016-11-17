import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './components/app/app.component';
import { PtsLoginComponent } from './components/pts-login/pts-login.component';
import { PtsRegisterComponent } from './components/pts-register/pts-register.component';
import { PtsToolbarComponent } from './components/pts-toolbar/pts-toolbar.component';
import { PtsContentComponent } from './components/pts-content/pts-content.component';
import { PtsListViewComponent } from './components/pts-list-view/pts-list-view.component';
import { PtsListItemComponent } from './components/pts-list-item/pts-list-item.component';
import { PtsContentAdminComponent } from './components/pts-content-admin/pts-content-admin.component';
import { PtsContentDeejayComponent } from './components/pts-content-deejay/pts-content-deejay.component';
import { PtsNotifyComponent } from './components/pts-notify/pts-notify.component';

import { AuthService } from "./services/auth.service";
import { StorageService } from "./services/storage.service";
import { HttpService } from "./services/http.service";

import { HttpHelper } from "./helpers/http.helper";
import { AuthHelper } from "./helpers/auth.helper";
import { SocketHelper } from "./helpers/socket.helper";

@NgModule({
  declarations: [
    AppComponent,
    PtsLoginComponent,
    PtsRegisterComponent,
    PtsToolbarComponent,
    PtsContentComponent,
    PtsContentAdminComponent,
    PtsContentDeejayComponent,
    PtsListViewComponent,
    PtsListItemComponent,
    PtsNotifyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [
    AuthService,
    StorageService,
    HttpService,
    SocketHelper,
    HttpHelper,
    AuthHelper
  ],
  bootstrap: [AppComponent]
})

export class AppModule { }
