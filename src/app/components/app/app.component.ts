import { Component, ViewChild, OnInit } from "@angular/core";

import { StorageService } from "../../services/storage.service";
import { AuthHelper } from "./../../helpers/auth.helper";

import { LoginData } from "../../models/login-data";
import { NotifyMessage } from "../../models/notify-message";
import { LSItem } from "../../models/ls-item";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent implements OnInit {
  @ViewChild("ptsLogin") ptsLogin;
  @ViewChild("ptsNotify") ptsNotify;

  constructor (
    private storageService: StorageService,
    private authHelper: AuthHelper
  ) { }

  ngOnInit () {
    this.storageService.getMany([this.storageService.TOKENKEY, this.storageService.EXPIREKEY])
      .then(items => {
        // check if token is available
        if (!items[0].value) {
          this.handleNotifyUser(new NotifyMessage(false, "User is not logged in!"));
          this.handleOpenLogin();
          return;
        }
        // check if login is expired
        if (this.authHelper.isLoginExpired(Number(items[1].value))) {
          this.handleNotifyUser(new NotifyMessage(false, "User login is expired!"));
          this.handleOpenLogin();
          return;
        }
        // show message if all is great
        this.handleNotifyUser(new NotifyMessage(true, "User successfully logged in!"));
      })
      .catch(error => this.handleNotifyUser(error));
  }

  private handleNotifyUser (nm: NotifyMessage): void {
    this.ptsNotify.showMessage(nm.success, nm.message);
  }

  private handleLoginData (ld: LoginData): void {
    let tokenItem: LSItem = new LSItem(this.storageService.TOKENKEY, ld.token);
    let expireItem: LSItem = new LSItem(this.storageService.EXPIREKEY, ld.expires.toString());
    this.storageService.saveMany([tokenItem, expireItem])
      .then(msg => this.handleNotifyUser(msg))
      .catch(error => this.handleNotifyUser(error));
  }

  private handleOpenLogin (): void {
    this.ptsLogin.openDialog();
  }

  private handleOpenRegister (): void {
    alert("Register Dialog");
  }

  private handleOpenEvent (): void {
    alert("Event Dialog");
  }

  private handleLogoutUser (): void {
    this.storageService.removeMany([this.storageService.TOKENKEY, this.storageService.EXPIREKEY])
      .then(msg => {
        this.handleNotifyUser(msg);
        this.handleNotifyUser(new NotifyMessage(true, "User successfully logged out!"));
        this.handleOpenLogin();
      })
      .catch(error => this.handleNotifyUser(error));
  }
}
