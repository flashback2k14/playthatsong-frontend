import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'pts-toolbar',
  templateUrl: './pts-toolbar.component.html',
  styleUrls: ['./pts-toolbar.component.css']
})

export class PtsToolbarComponent {
  @Output() openLogin: EventEmitter<void>;
  @Output() openEvent: EventEmitter<void>;

  private title: string = "play that song!";

  constructor () {
    this.openLogin = new EventEmitter<void>();
    this.openEvent = new EventEmitter<void>();
  }

  private openLoginDialog (): void {
    this.openLogin.emit();
  }

  private openEventDialog (): void {
    this.openEvent.emit();
  }
}
