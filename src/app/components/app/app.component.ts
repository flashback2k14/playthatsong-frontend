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
  @ViewChild("ptsRegister") ptsRegister;
  @ViewChild("ptsNotify") ptsNotify;

  private userIsLoggedIn: boolean;
  private userName: string;

  constructor (
    private storageService: StorageService,
    private authHelper: AuthHelper
  ) { 
    this.userIsLoggedIn = false;
  }

  ngOnInit () {
    this.storageService.getMany([this.storageService.TOKENKEY, 
                                this.storageService.EXPIREKEY,
                                this.storageService.USERNAMEKEY])
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
        // set flags
        this.userIsLoggedIn = true;
        // set username
        this.userName = items[2].value;
        // show message if all is great
        this.handleNotifyUser(new NotifyMessage(true, "User successfully logged in!"));
      })
      .catch(error => this.handleNotifyUser(error));
  }

  /**
   * NOTIFICATION
   */
  private handleNotifyUser (nm: NotifyMessage): void {
    this.ptsNotify.showMessage(nm.success, nm.message);
  }

  /**
   * LOGIN / REGISTER
   */
  private handleLoginRegisterUser (ld: LoginData): void {
    let tokenItem: LSItem = new LSItem(this.storageService.TOKENKEY, ld.token);
    let expireItem: LSItem = new LSItem(this.storageService.EXPIREKEY, ld.expires.toString());
    let usernameItem: LSItem = new LSItem(this.storageService.USERNAMEKEY, ld.user.name);
    this.storageService.saveMany([tokenItem, expireItem, usernameItem])
      .then(msg => {
        this.handleNotifyUser(msg);
        this.userIsLoggedIn = true;
        this.userName = ld.user.name;
      })
      .catch(error => this.handleNotifyUser(error));
  }

  /**
   * LOGOUT
   */
  private handleLogoutUser (): void {
    this.storageService.removeMany([this.storageService.TOKENKEY, 
                                    this.storageService.EXPIREKEY,
                                    this.storageService.USERNAMEKEY])
      .then(msg => {
        this.handleNotifyUser(msg);
        this.handleNotifyUser(new NotifyMessage(true, "User successfully logged out!"));
        this.handleOpenLogin();
        this.userIsLoggedIn = false;
        this.userName = null;
      })
      .catch(error => this.handleNotifyUser(error));
  }

  /**
   * OPEN DIALOGS
   */
  private handleOpenLogin (): void {
    this.ptsLogin.openDialog();
  }

  private handleOpenRegister (): void {
    this.ptsRegister.openDialog();
  }

  private handleDialogCanceled (): void {
    this.userName = "view only";
  }
}
