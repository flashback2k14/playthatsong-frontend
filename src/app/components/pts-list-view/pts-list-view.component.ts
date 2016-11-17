import { Output } from "@angular/core";
import { Component, Input, EventEmitter } from "@angular/core";
import { User } from "./../../models/user";

@Component({
  selector: 'pts-list-view',
  templateUrl: './pts-list-view.component.html',
  styleUrls: ['./pts-list-view.component.css']
})
export class PtsListViewComponent {
  @Input() deejays: User[];
  @Input() events: Event[];

  @Output() goToEvents: EventEmitter<User>;
  @Output() goToSongs: EventEmitter<Event>;

  constructor () {
    this.goToEvents = new EventEmitter<User>();
    this.goToSongs = new EventEmitter<Event>();
  }

  private handleGoToEvents (dj: User): void {
    this.goToEvents.emit(dj);
  }

  private handleGoToSongs (item: Event): void {
    this.goToSongs.emit(item);
  }
}
