import { Component, Input, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";

import { User } from "./../../models/user";


@Component({
  selector: 'pts-list-item',
  templateUrl: './pts-list-item.component.html',
  styleUrls: ['./pts-list-item.component.css']
})

export class PtsListItemComponent {
  @Input() item: User;
  @Output() goToEvents: EventEmitter<User>;

  constructor () {
    this.goToEvents = new EventEmitter<User>();
  }

  private goToNextStep (item: User): void {
    this.goToEvents.emit(item);
  }
}
