import { Song } from "./../../models/song";
import { Component, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";

import { HttpService } from "./../../services/http.service";
import { StorageService } from "./../../services/storage.service";

import { User } from "./../../models/user";
import { Event } from "./../../models/event";
import { NotifyMessage } from "./../../models/notify-message";
import { ContentType } from "./../../models/content-type";


@Component({
  selector: 'pts-content',
  templateUrl: './pts-content.component.html',
  styleUrls: ['./pts-content.component.css']
})

export class PtsContentComponent implements OnInit {
  @Output() notifyUser: EventEmitter<NotifyMessage>;

  private showDeejayList: boolean;
  private showEventsList: boolean;
  private showSongsList: boolean;
  private showBackButton: boolean;

  private contentState: ContentType;

  private userToken: string;

  private deejays: User[];
  private events: Event[];
  private songs: Song[];

  constructor (
    private httpService: HttpService,
    private storageService: StorageService
  ) { 
    this.notifyUser = new EventEmitter<NotifyMessage>();
    this.showDeejayList = false;
    this.showEventsList = false;
    this.showSongsList = false;
    this.showBackButton = false;
    this.contentState = ContentType.Clear;
  }

  ngOnInit () {
    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(tokenItem => this.userToken = tokenItem.value)
      .catch(error => this.notifyUser.emit(error));
  }

  /**
   * HANDLE EVENTS
   */
  private handleGoToEvents (dj: User): void {
    this.loadEventDataByDeejay(dj._id);
  }

  private handleGoToSongs(event: Event): void {
    this.loadSongDataByEvent(event._id);
  }

  /**
   * LOAD DATA - PRIVATE
   */
  private loadEventDataByDeejay (deejayId: string): void {
    this.httpService.getEventsByDeejay(this.userToken, deejayId)
      .then(data => {
        this.events = data;
        this.switchContentAreas("events");
      })
      .catch(error => this.notifyUser.emit(error));
  }

  private loadSongDataByEvent (eventId: string): void {
    this.httpService.getSongsByEvent(this.userToken, eventId)
      .then(data => {
        this.songs = data;
        this.switchContentAreas("songs");
      })
      .catch(error => this.notifyUser.emit(error));
  }

  /**
   * CONTENT UTIL
   */
  private switchContentAreas (area: string): void {
    switch (area) {
      case "deejay":
        this.showDeejayList = true;
        this.showEventsList = false;
        this.showSongsList = false;
        this.showBackButton = false;
        this.contentState = ContentType.Deejays;
        break;
      
      case "events":
        this.showDeejayList = false;
        this.showEventsList = true;
        this.showSongsList = false;
        this.showBackButton = true;
        this.contentState = ContentType.Events;
        break;

      case "songs":
        this.showDeejayList = false;
        this.showEventsList = false;
        this.showSongsList = true;
        this.showBackButton = true;
        this.contentState = ContentType.Songs;
        break;
      
      case "clear":
        this.showDeejayList = false;
        this.showEventsList = false;
        this.showSongsList = false;
        this.showBackButton = false;
        this.contentState = ContentType.Clear;
        break;

      default:
        break;
    }
  }

  private goBack (): void {
    if (this.contentState === ContentType.Songs) {
      this.switchContentAreas("events");
      return;
    }
    if (this.contentState === ContentType.Events) {
      this.switchContentAreas("deejay");
      return;
    }
  }

  /**
   * LOAD DATA - PUBLIC
   */
  loadUserData (): void {
    this.httpService.getDeejays(this.userToken)
      .then(data => {
        this.deejays = data;
        this.switchContentAreas("deejay");
      })
      .catch(error => this.notifyUser.emit(error));
  }

  /**
   * CLEAR DATA - PUBLIC
   */
  clearData(): void {
    this.deejays = null;
    this.events = null;
    this.switchContentAreas("clear");
  }
}
