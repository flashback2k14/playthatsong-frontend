import { Component, Input, Output, EventEmitter } from "@angular/core";
import { User } from "./../../models/user";
import { Event } from "./../../models/event";
import { Song } from "./../../models/song";


@Component({
  selector: 'pts-list-view',
  templateUrl: './pts-list-view.component.html',
  styleUrls: ['./pts-list-view.component.css']
})

export class PtsListViewComponent {
  @Input() deejays: User[];
  @Input() events: Event[];
  @Input() songs: Song[];

  @Output() goToEvents: EventEmitter<User>;
  @Output() goToSongs: EventEmitter<Event>;
  @Output() upvoteSong: EventEmitter<Song>;
  @Output() downvoteSong: EventEmitter<Song>;

  constructor () {
    this.goToEvents = new EventEmitter<User>();
    this.goToSongs = new EventEmitter<Event>();
    this.upvoteSong = new EventEmitter<Song>();
    this.downvoteSong = new EventEmitter<Song>();
  }

  /**
   * DEEJAY
   */
  private handleGoToEvents (dj: User): void {
    this.goToEvents.emit(dj);
  }

  /**
   * EVENT
   */
  private handleGoToSongs (item: Event): void {
    this.goToSongs.emit(item);
  }

  /**
   * SONG
   */
  private handleUpvoteSong (item: Song): void {
    this.upvoteSong.emit(item);
  }

  private handleDownvoteSong (item: Song): void {
    this.downvoteSong.emit(item);
  }
}
