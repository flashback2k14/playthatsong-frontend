import { Component, ViewChild, AfterViewInit } from "@angular/core";

import { StorageService } from "../../services/storage.service";

import { LoginData } from "../../models/login-data";
import { NotifyMessage } from "../../models/notify-message";
import { LSItem } from "../../models/ls-item";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})

export class AppComponent implements AfterViewInit {
  @ViewChild("ptsLogin") ptsLogin;
  @ViewChild("ptsNotify") ptsNotify;

  constructor (private storageService: StorageService) { }

  ngAfterViewInit () {
    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(item => {
        if (!item.value) {
          this.handleOpenLogin();
        }
        this.handleNotifyUser(new NotifyMessage(true, "User successfully logged in!"));
      })
      .catch(error => this.handleNotifyUser(error));
  }

  private handleNotifyUser (nm: NotifyMessage): void {
    this.ptsNotify.showMessage(nm.success, nm.message);
  }

  private handleLoginData (ld: LoginData): void {
    let saveItem: LSItem = new LSItem(this.storageService.TOKENKEY, ld.token);
    this.storageService.saveOne(saveItem)
      .then(msg => this.handleNotifyUser(msg))
      .catch(error => this.handleNotifyUser(error));
  }

  private handleOpenLogin (): void {
    this.ptsLogin.openDialog();
  }

  private handleOpenEvent (): void {
    alert("Event Dialog");
  }
}
