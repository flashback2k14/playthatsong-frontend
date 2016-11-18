import { 
  Component, Output, EventEmitter, OnInit, OnDestroy, ViewChild 
} from "@angular/core";

import { HttpService } from "./../../services/http.service";
import { StorageService } from "./../../services/storage.service";

import { SocketHelper } from "./../../helpers/socket.helper";

import { User } from "./../../models/user";
import { Event } from "./../../models/event";
import { Song } from "./../../models/song";

import { NotifyMessage } from "./../../models/notify-message";
import { ContentType } from "./../../models/content-type";
import { SocketEvents } from "./../../models/socket-events";

@Component({
  selector: 'pts-content',
  templateUrl: './pts-content.component.html',
  styleUrls: ['./pts-content.component.css']
})

export class PtsContentComponent implements OnInit, OnDestroy {
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
    private storageService: StorageService,
    private socketHelper: SocketHelper
  ) { 
    this.notifyUser = new EventEmitter<NotifyMessage>();
    this.showDeejayList = false;
    this.showEventsList = false;
    this.showSongsList = false;
    this.showBackButton = false;
    this.contentState = ContentType.Clear;
  }

  /**
   * LIFE CYCLE EVENTS
   */
  ngOnInit () {
    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(tokenItem => this.userToken = tokenItem.value)
      .catch(error => this.notifyUser.emit(error));

    this.initSocketListener(); 
  }

  ngOnDestroy () {
    this.removeSocketListener();
  }

  private initSocketListener (): void {
    /**
     * ADDED
     */
    this.socketHelper.getSocket().on(SocketEvents.DEEJAYADDED, (addedDeejay) => {
      this.deejays.push(addedDeejay);
    });
    this.socketHelper.getSocket().on(SocketEvents.EVENTADDED, (addedEvent) => {
      this.events.push(addedEvent);
    });
    this.socketHelper.getSocket().on(SocketEvents.SONGADDED, (addedSong) => {
      this.songs.push(addedSong);
    });
    /**
     * UPDATED
     */
    this.socketHelper.getSocket()
      .on(SocketEvents.DEEJAYUPDATED, (updatedDeejay: User) => {
        let i: number = this.deejays.findIndex((el): boolean => { 
          return el._id === updatedDeejay._id;
        });
        this.deejays.splice(i, 1, updatedDeejay);
      });
    this.socketHelper.getSocket()
      .on(SocketEvents.EVENTUPDATED, (updatedEvent: Event) => {
        let i: number = this.events.findIndex((el): boolean => { 
          return el._id === updatedEvent._id;
        });
        this.events.splice(i, 1, updatedEvent);
      });
    this.socketHelper.getSocket()
      .on(SocketEvents.SONGUPDATED, (updatedSong: Song) => {
        let i: number = this.songs.findIndex((el): boolean => { 
          return el._id === updatedSong._id;
        });
        this.songs.splice(i, 1, updatedSong);
      });
    /**
     * DELETED
     */
    this.socketHelper.getSocket()
      .on(SocketEvents.DEEJAYDELETED, (deletedDeejay: User) => {
        let i: number = this.deejays.findIndex((el): boolean => { 
          return el._id === deletedDeejay._id;
        });
        this.deejays = this.deejays.slice(i, 1);
      });
    this.socketHelper.getSocket()
      .on(SocketEvents.EVENTDELETED, (deletedEvent: Event) => {
        let i: number = this.events.findIndex((el): boolean => { 
          return el._id === deletedEvent._id;
        });
        this.events = this.events.slice(i, 1);
      });
    this.socketHelper.getSocket()
      .on(SocketEvents.SONGDELETED, (deletedSong: Song) => {
        let i: number = this.songs.findIndex((el): boolean => { 
          return el._id === deletedSong._id
        });
        this.songs = this.songs.slice(i, 1);
      });
  }

  private removeSocketListener (): void {
    this.socketHelper.getSocket().off(SocketEvents.DEEJAYADDED);
    this.socketHelper.getSocket().off(SocketEvents.EVENTADDED);
    this.socketHelper.getSocket().off(SocketEvents.SONGADDED);
    this.socketHelper.getSocket().off(SocketEvents.DEEJAYUPDATED);
    this.socketHelper.getSocket().off(SocketEvents.EVENTUPDATED);
    this.socketHelper.getSocket().off(SocketEvents.SONGUPDATED);
    this.socketHelper.getSocket().off(SocketEvents.DEEJAYDELETED);
    this.socketHelper.getSocket().off(SocketEvents.EVENTDELETED);
    this.socketHelper.getSocket().off(SocketEvents.SONGDELETED);
  }

  /**
   * HANDLE EVENTS
   */
  private handleGoToEvents (dj: User): void {
    this.loadEventDataByDeejay(dj._id);
  }

  private handleGoToSongs (event: Event): void {
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
  clearData (): void {
    this.deejays = null;
    this.events = null;
    this.switchContentAreas("clear");
  }
}
