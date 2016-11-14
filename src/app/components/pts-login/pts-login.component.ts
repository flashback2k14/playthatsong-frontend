import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Output, EventEmitter } from "@angular/core";
const dialogPolyfill = require("dialog-polyfill");

import { AuthService } from "../../services/auth.service";
import { LoginData } from "../../models/login-data";
import { NotifyMessage } from "../../models/notify-message";


@Component({
  selector: 'pts-login',
  templateUrl: './pts-login.component.html',
  styleUrls: ['./pts-login.component.css']
})

export class PtsLoginComponent implements AfterViewInit {
  @Output() notifyUser: EventEmitter<NotifyMessage>;
  @Output() loginUser: EventEmitter<LoginData>;
  @Output() loginCanceled: EventEmitter<void>;

  @ViewChild("loginDialog") loginDialog;
  @ViewChild("txtUsernameContainer") txtUsernameContainer;
  @ViewChild("txtPasswordContainer") txtPasswordContainer;
  @ViewChild("txtUsername") txtUsername;
  @ViewChild("txtPassword") txtPassword;

  private neLoginDialog: any;
  private neTxtUsernameContainer: HTMLElement;
  private neTxtPasswordContainer: HTMLElement;
  private neTxtUsername: HTMLInputElement;
  private neTxtPassword: HTMLInputElement;

  constructor (private authService: AuthService) { 
    this.notifyUser = new EventEmitter<NotifyMessage>();
    this.loginUser = new EventEmitter<LoginData>();
    this.loginCanceled = new EventEmitter<void>();
  }

  ngAfterViewInit () {
    this.neLoginDialog = this.loginDialog.nativeElement;
    if (!this.neLoginDialog.showModal) {
      dialogPolyfill.registerDialog(this.neLoginDialog);
    }
    this.neTxtUsernameContainer = this.txtUsernameContainer.nativeElement;
    this.neTxtPasswordContainer = this.txtPasswordContainer.nativeElement;
    this.neTxtUsername = this.txtUsername.nativeElement;
    this.neTxtPassword = this.txtPassword.nativeElement;
  }
  
  openDialog (): void {
    this.neLoginDialog.showModal();
  }

  private login () {
    let username: string = this.neTxtUsername.value;
    let password: string = this.neTxtPassword.value;
    
    if (username.length <= 0) { return; }
    if (password.length <= 0) { return; }

    this.authService.login(username, password)
      .then(data => {
        this.notifyUser.emit(new NotifyMessage(true, `${data.user.name} successfully logged in!`));
        this.loginUser.emit(data);
        this.cancelDialog();
      })
      .catch(error => {
        this.notifyUser.emit(error);
        this.clearInputs(false);
      });
  }

  private cancelDialog (): void {
    this.clearInputs(true);
    this.loginCanceled.emit();
    this.neLoginDialog.close();
  }

  private clearInputs (fullClear: boolean) {
    if (fullClear) {
      this.neTxtUsernameContainer.classList.remove("is-focused");
      this.neTxtUsernameContainer.classList.remove("is-dirty");
      this.neTxtUsername.value = "";
    }
    this.neTxtPasswordContainer.classList.remove("is-focused");
		this.neTxtPasswordContainer.classList.remove("is-dirty");
    this.neTxtPassword.value = "";
  }
}
