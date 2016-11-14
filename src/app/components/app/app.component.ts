import { Component, ViewChild, OnInit } from "@angular/core";
import { Router } from "@angular/router";

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

export class AppComponent implements OnInit {
  @ViewChild("ptsLogin") ptsLogin;
  @ViewChild("ptsRegister") ptsRegister;
  @ViewChild("ptsNotify") ptsNotify;

  private userIsLoggedIn: boolean;
  private userName: string;

  constructor (
    private storageService: StorageService,
    private authHelper: AuthHelper,
    private router: Router
  ) { 
    this.userIsLoggedIn = false;
  }

  ngOnInit () {
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
          this.handleNotifyUser(new NotifyMessage(false, "User login is expired!"));
          this.handleOpenLogin();
          return;
        }
        // set flags
        this.userIsLoggedIn = true;
        // navigate to specific route
        const user = this.authHelper.convertStringToUser(items[2].value);
        this.decideWhereToGo(user);
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
        this.decideWhereToGo(ld.user);
      })
      .catch(error => this.handleNotifyUser(error));
  }

  /**
   * LOGOUT
   */
  private handleLogoutUser (): void {
    this.storageService.removeMany([this.storageService.TOKENKEY, 
                                    this.storageService.EXPIREKEY,
                                    this.storageService.USEROBJECTKEY])
      .then(msg => {
        this.handleNotifyUser(msg);
        this.handleNotifyUser(new NotifyMessage(true, "User successfully logged out!"));
        this.handleOpenLogin();
        this.navigateTo("/");
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

  /**
   * ROUTING
   */
  private decideWhereToGo (user: User): void {
    // if admin, go to admin route
    if (user.admin) {
      this.navigateTo("/admin");
      this.userName = `${user.name} [A]`;
    }
    // if deejay, go to dj route
    if (user.deejay) {
      this.navigateTo("/deejay");
      this.userName = `${user.name} [D]`;
    }
    // else stay at user route
    if (!user.admin && !user.deejay) {
      this.navigateTo("/");
      this.userName = `${user.name} [10]`;
    }
  }

  private navigateTo (route: string): void {
    let link = [route];
    this.router.navigate(link);
  }
}
