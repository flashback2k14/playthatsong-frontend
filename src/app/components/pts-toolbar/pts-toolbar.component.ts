import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pts-toolbar',
  templateUrl: './pts-toolbar.component.html',
  styleUrls: ['./pts-toolbar.component.css']
})

export class PtsToolbarComponent {
  @Output() openLogin: EventEmitter<void>;
  @Output() openRegister: EventEmitter<void>;
  @Output() openEvent: EventEmitter<void>;
  @Output() logoutUser: EventEmitter<void>;

  @Input() isLoggedIn: boolean;

  private title: string = "play that song!";

  constructor () {
    this.openLogin = new EventEmitter<void>();
    this.openRegister = new EventEmitter<void>();
    this.openEvent = new EventEmitter<void>();
    this.logoutUser = new EventEmitter<void>();
  }

  private openLoginDialog (): void {
    this.openLogin.emit();
  }

  private openRegisterDialog (): void {
    this.openRegister.emit();
  } 

  private openEventDialog (): void {
    this.openEvent.emit();
  }

  private logout (): void {
    this.logoutUser.emit();
  }
}
