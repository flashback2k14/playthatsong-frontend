import { Component, Input, Output } from "@angular/core";
import { EventEmitter } from "@angular/core";

import { User } from "./../../models/user";
import { Event } from "./../../models/event";


@Component({
  selector: 'pts-list-item',
  templateUrl: './pts-list-item.component.html',
  styleUrls: ['./pts-list-item.component.css']
})

export class PtsListItemComponent {
  @Input() deejay: User;
  @Input() event: Event;
  
  @Output() goToEvents: EventEmitter<User>;
  @Output() goToSongs: EventEmitter<Event>;

  constructor () {
    this.goToEvents = new EventEmitter<User>();
    this.goToSongs = new EventEmitter<Event>();
  }

  private goToNextStep (item: User): void {
    this.goToEvents.emit(item);
  }

  private goToLastStep (item: Event): void {
    this.goToSongs.emit(item);
  }
}
