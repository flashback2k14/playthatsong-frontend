import { element } from "protractor";
import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { Output, EventEmitter } from "@angular/core";
const dialogPolyfill = require("dialog-polyfill");

import { AuthService } from "./../../services/auth.service";
import { LoginData } from "./../../models/login-data";
import { RegisterData } from "./../../models/register-data";
import { NotifyMessage } from "./../../models/notify-message";


@Component({
  selector: 'pts-register',
  templateUrl: './pts-register.component.html',
  styleUrls: ['./pts-register.component.css']
})

export class PtsRegisterComponent implements AfterViewInit {
  @Output() notifyUser: EventEmitter<NotifyMessage>;
  @Output() registerUser: EventEmitter<LoginData>;
  @Output() registerCanceled: EventEmitter<void>;

  @ViewChild("registerDialog") registerDialog;
  @ViewChild("txtUsernameContainer") txtUsernameContainer;
  @ViewChild("txtPasswordContainer") txtPasswordContainer;
  @ViewChild("txtPasswordRepeatContainer") txtPasswordRepeatContainer;
  @ViewChild("txtUsername") txtUsername;
  @ViewChild("txtPassword") txtPassword;
  @ViewChild("txtPasswordRepeat") txtPasswordRepeat;

  constructor (private authService: AuthService) {
    this.notifyUser = new EventEmitter<NotifyMessage>();
    this.registerUser = new EventEmitter<LoginData>();
    this.registerCanceled = new EventEmitter<void>();
  }

  ngAfterViewInit () {
    if (!this.getNativeElement(this.registerDialog).showModal) {
      dialogPolyfill.registerDialog(this.getNativeElement(this.registerDialog));
    }
  }

  openDialog (): void {
    this.getNativeElement(this.registerDialog).showModal();
  }

  private register () {
    let username: string = this.getNativeElement(this.txtUsername).value;
    let password: string = this.getNativeElement(this.txtPassword).value;
    let passwordRepeat: string = this.getNativeElement(this.txtPasswordRepeat).value;
    
    if (username.length <= 0) { return; }
    if (password.length <= 0) { return; }
    if (passwordRepeat.length <= 0) { return; }

    if (!password.match(passwordRepeat)) {
      this.clearInputs(false);
      this.notifyUser.emit(new NotifyMessage(false, "Passwords doesn't match! Please retry!"));
    }

    this.authService.register(username, password).then(regData => {
      // notify user
      this.notifyUser.emit(new NotifyMessage(true, `${regData.createdUser.name} successfully registered! Now logging in!`));
      // login user
      this.authService.login(username, password).then(logData => {
        this.notifyUser.emit(new NotifyMessage(true, `${logData.user.name} successfully logged in!`));
        this.registerUser.emit(logData);
        this.cancelDialog();
      })
    }).catch(error => {
      this.notifyUser.emit(error);
      this.clearInputs(false);
    });
  }

  private cancelDialog (): void {
    this.clearInputs(true);
    this.getNativeElement(this.registerDialog).close();
    this.registerCanceled.emit();
  }

  private clearInputs (fullClear: boolean) {
    if (fullClear) {
      this.getNativeElement(this.txtUsernameContainer).classList.remove("is-focused");
      this.getNativeElement(this.txtUsernameContainer).classList.remove("is-dirty");
      this.getNativeElement(this.txtUsername).value = "";
    }
    this.getNativeElement(this.txtPasswordContainer).classList.remove("is-focused");
    this.getNativeElement(this.txtPasswordContainer).classList.remove("is-dirty");
    this.getNativeElement(this.txtPassword).value = "";
    this.getNativeElement(this.txtPasswordRepeatContainer).classList.remove("is-focused");
		this.getNativeElement(this.txtPasswordRepeatContainer).classList.remove("is-dirty");
    this.getNativeElement(this.txtPasswordRepeat).value = "";
  }

  private getNativeElement (element: any): any {
    return element.nativeElement;
  }
}
