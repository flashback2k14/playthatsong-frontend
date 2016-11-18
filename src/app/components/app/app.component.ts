import { Component, ViewChild, AfterViewInit } from "@angular/core";

import { PtsLoginComponent } from "./../pts-login/pts-login.component";
import { PtsRegisterComponent } from "./../pts-register/pts-register.component";
import { PtsContentComponent } from "./../pts-content/pts-content.component";
import { PtsNotifyComponent } from "./../pts-notify/pts-notify.component";

import { StorageService } from "../../services/storage.service";
import { AuthHelper } from "./../../helpers/auth.helper";

import { LoginData } from "../../models/login-data";
import { NotifyMessage } from "../../models/notify-message";
import { LSItem } from "../../models/ls-item";
import { User } from "./../../models/user";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent implements AfterViewInit {
  @ViewChild("ptsLogin") ptsLogin: PtsLoginComponent;
  @ViewChild("ptsRegister") ptsRegister: PtsRegisterComponent;
  @ViewChild("ptsContent") ptsContent: PtsContentComponent;
  @ViewChild("ptsNotify") ptsNotify: PtsNotifyComponent;

  private userIsLoggedIn: boolean;
  private userName: string;
  private showUserContent: boolean;
  private showAdminContent: boolean;
  private showDeejayContent: boolean;

  constructor (
    private storageService: StorageService,
    private authHelper: AuthHelper
  ) { 
    this.userIsLoggedIn = false;
    this.userName = null;
    this.showUserContent = true;
    this.showAdminContent = false;
    this.showDeejayContent = false;
  }

  ngAfterViewInit () {
    this.storageService.getMany([this.storageService.TOKENKEY, 
                                this.storageService.EXPIREKEY,
                                this.storageService.USEROBJECTKEY])
      .then(items => {
        // check if token is available
        if (!items[0].value) {
          this.handleNotifyUser(new NotifyMessage(false, "User is not logged in!"));
          this.handleOpenLogin();
          return;
        }
        // check if login is expired
        if (this.authHelper.isLoginExpired(Number(items[1].value))) {
          this.logout(new NotifyMessage(false, "User login is expired!"))
          return;
        }
        // set flags
        this.userIsLoggedIn = true;
        // navigate to specific route
        const user = this.authHelper.convertStringToUser(items[2].value);
        this.decideWhereToGo(user, items[0].value);
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
    let userItem: LSItem = new LSItem(this.storageService.USEROBJECTKEY, this.authHelper.convertUserToString(ld.user));
    this.storageService.saveMany([tokenItem, expireItem, userItem])
      .then(msg => {
        // show user info
        this.handleNotifyUser(msg);
        // set flag
        this.userIsLoggedIn = true;
        // navigate to specific route
        this.decideWhereToGo(ld.user, ld.token);
      })
      .catch(error => this.handleNotifyUser(error));
  }

  /**
   * LOGOUT
   */
  private handleLogoutUser (): void {
    this.logout(new NotifyMessage(true, "User successfully logged out!"));
  }

  private logout (nm: NotifyMessage): void {
    this.storageService.removeMany([this.storageService.TOKENKEY, 
                                    this.storageService.EXPIREKEY,
                                    this.storageService.USEROBJECTKEY])
      .then(msg => {
        this.handleNotifyUser(msg);
        this.handleNotifyUser(nm);
        this.handleOpenLogin();
        this.navigateTo("home");
        this.ptsContent.clearData();
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
    this.navigateTo("home");
  }

  /**
   * ROUTING
   */
  private decideWhereToGo (user: User, token: string): void {
    // if admin, go to admin route
    if (user.admin) {
      this.navigateTo("admin");
      this.userName = `${user.name} [A]`;
    }
    // if deejay, go to dj route
    if (user.deejay) {
      this.navigateTo("deejay");
      this.userName = `${user.name} [D]`;
    }
    // if user, go to user route
    if (!user.admin && !user.deejay) {
      this.navigateTo("home");
      this.userName = `${user.name} [10]`;
      this.ptsContent.loadUserData(token);
    }
  }

  private navigateTo (contentArea: string): void {
    switch (contentArea) {
      case "home":
        this.showUserContent = true;
        this.showAdminContent = false;
        this.showDeejayContent = false;
        window.location.hash = "home";
        break;

      case "admin":
        this.showUserContent = false;
        this.showAdminContent = true;
        this.showDeejayContent = false;
        window.location.hash = "admin";
        break;

      case "deejay":
        this.showUserContent = false;
        this.showAdminContent = false;
        this.showDeejayContent = true;
        window.location.hash = "deejay";
        break;

      default:
        break;
    }
  }
}
