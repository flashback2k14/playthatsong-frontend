import { Output } from "@angular/core";
import { Component, Input, EventEmitter } from "@angular/core";
import { User } from "./../../models/user";

@Component({
  selector: 'pts-list-view',
  templateUrl: './pts-list-view.component.html',
  styleUrls: ['./pts-list-view.component.css']
})
export class PtsListViewComponent {
  @Input() items: User[];
  @Output() goToEvents: EventEmitter<User>;

  constructor () {
    this.goToEvents = new EventEmitter<User>();
  }

  private handleGoToEvents (dj: User): void {
    this.goToEvents.emit(dj);
  }
}
