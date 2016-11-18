import { Component, Input, Output, OnInit } from "@angular/core";
import { EventEmitter } from "@angular/core";

import { User } from "./../../models/user";
import { Event } from "./../../models/event";
import { Song } from "./../../models/song";

@Component({
  selector: 'pts-list-item',
  templateUrl: './pts-list-item.component.html',
  styleUrls: ['./pts-list-item.component.css']
})

export class PtsListItemComponent implements OnInit {
  @Input() deejay: User;
  @Input() event: Event;
  @Input() song: Song;
  
  @Output() goToEvents: EventEmitter<User>;
  @Output() goToSongs: EventEmitter<Event>;
  @Output() upvoteSong: EventEmitter<Song>;
  @Output() downvoteSong: EventEmitter<Song>;

  private calculatedSongVotes: number;

  constructor () {
    this.goToEvents = new EventEmitter<User>();
    this.goToSongs = new EventEmitter<Event>();
    this.upvoteSong = new EventEmitter<Song>();
    this.downvoteSong = new EventEmitter<Song>();
    this.calculatedSongVotes = 0;
  }

  ngOnInit () {
    if (this.song) {
      this.calculatedSongVotes = this.song.upvotes - this.song.downvotes;
    }
  }

  /**
   * DEEJAY
   */
  private goToNextStep (item: User): void {
    this.goToEvents.emit(item);
  }

  /**
   * EVENT
   */
  private goToLastStep (item: Event): void {
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
