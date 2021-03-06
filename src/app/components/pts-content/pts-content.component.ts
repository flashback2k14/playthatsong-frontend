import { 
  Component, Input, Output, EventEmitter, OnInit, OnDestroy, ViewChild 
} from "@angular/core";

import { Observable, Subscription } from "rxjs/Rx";

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
  @Output() changeUserVoting: EventEmitter<number>;

  @Input() userId: string;

  private showNoAuth: boolean;
  private showDeejayList: boolean;
  private showEventsList: boolean;
  private showSongsList: boolean;
  private showBackButton: boolean;

  private contentState: ContentType;
  private pickedEventId: string;

  private deejays: User[];
  private events: Event[];
  private songs: Song[];

  private isFirstVote: boolean;
  private resetChangeUserVotingTimer: Observable<number>;
  private resetChangeUserVotingSubscription: Subscription;
  private WAITTIME: number = 180000; // 1000 * 60 * 60 + 1; // one hour + one minute to wait for the backend is ready
  private USERVOTING: number = 10;

  constructor (
    private httpService: HttpService,
    private storageService: StorageService,
    private socketHelper: SocketHelper
  ) { 
    this.notifyUser = new EventEmitter<NotifyMessage>();
    this.changeUserVoting = new EventEmitter<number>();
    this.showNoAuth = false;
    this.showDeejayList = false;
    this.showEventsList = false;
    this.showSongsList = false;
    this.showBackButton = false;
    this.contentState = ContentType.Clear;
    this.pickedEventId = null;
    this.isFirstVote = true;
  }

  /**
   * LIFE CYCLE EVENTS
   */
  ngOnInit () {
    this.initSocketListener(); 
  }

  ngOnDestroy () {
    this.removeSocketListener();
    if (this.resetChangeUserVotingSubscription) {
      this.resetChangeUserVotingSubscription.unsubscribe();
    }
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
      // add new song
      this.songs.push(addedSong);
      // wait if item is added to the DOM
      setTimeout(() => { this.scrollToBottom()}, 200);
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
        // recalc list ViewChild
        this.songs = this.songs.sort(this.recalcListview);
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
   * CONTENT UTIL
   */
  private switchContentAreas (area: string): void {
    switch (area) {
      case "noauth": 
        this.showNoAuth = true;
        this.showDeejayList = false;
        this.showEventsList = false;
        this.showSongsList = false;
        this.showBackButton = false;
        this.contentState = ContentType.Noauth;
        break;

      case "deejay":
        this.showNoAuth = false;
        this.showDeejayList = true;
        this.showEventsList = false;
        this.showSongsList = false;
        this.showBackButton = false;
        this.contentState = ContentType.Deejays;
        break;
      
      case "events":
        this.showNoAuth = false;
        this.showDeejayList = false;
        this.showEventsList = true;
        this.showSongsList = false;
        this.showBackButton = true;
        this.contentState = ContentType.Events;
        break;

      case "songs":
        this.showNoAuth = false;
        this.showDeejayList = false;
        this.showEventsList = false;
        this.showSongsList = true;
        this.showBackButton = true;
        this.contentState = ContentType.Songs;
        break;
      
      case "clear":
        this.showNoAuth = false;
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

  private scrollToBottom (): void {
    let items = document.querySelectorAll("pts-list-item");
    items[items.length-1].scrollIntoView({block: "start", behavior: "smooth"});
  }

  private recalcListview (a: Song, b: Song): number {
    let aVotes = a.upvotes - a.downvotes;
    let bVotes = b.upvotes - b.downvotes;
    
    if (aVotes > bVotes) return -1;
    if (aVotes < bVotes) return 1;
    return 0;
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
   * HANDLE EVENTS
   */
  private handleGoToEvents (dj: User): void {
    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(tokenItem => this.loadEventDataByDeejay(tokenItem.value, dj._id))
      .catch(error => this.notifyUser.emit(error));
  }

  private handleGoToSongs (event: Event): void {
    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(tokenItem => this.loadSongDataByEvent(tokenItem.value, event._id))
      .catch(error => this.notifyUser.emit(error));
  }

  private handleUpvoteSong (song: Song): void {
    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(tokenItem => this.patchSongDataById(tokenItem.value, song._id, "upvote"))
      .catch(error => this.notifyUser.emit(error));
  }

  private handleDownvoteSong (song: Song): void {
    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(tokenItem => this.patchSongDataById(tokenItem.value, song._id, "downvote"))
      .catch(error => this.notifyUser.emit(error));
  }

  /**
   * LOAD DATA - PRIVATE
   */
  private loadEventDataByDeejay (token: string, deejayId: string): void {
    this.httpService.getEventsByDeejay(token, deejayId)
      .then(data => {
        this.events = data;
        this.switchContentAreas("events");
      })
      .catch(error => this.notifyUser.emit(error));
  }

  private loadSongDataByEvent (token: string, eventId: string): void {
    this.httpService.getSongsByEvent(token, eventId)
      .then(data => {
        this.songs = data;
        this.pickedEventId = eventId;
        this.switchContentAreas("songs");
      })
      .catch(error => this.notifyUser.emit(error));
  }

  /**
   * LOAD DATA - PUBLIC
   */
  loadUserData (token: string): void {
    this.httpService.getDeejays(token)
      .then(data => {
        this.deejays = data;
        this.switchContentAreas("deejay");
      })
      .catch(error => this.notifyUser.emit(error));
  }

  /**
   * PATCH SONG VOTES
   */
  private patchSongDataById (token: string, songId: string, route: string) {
    // init timer for first voting
    if (this.isFirstVote) {
      this.resetChangeUserVotingTimer = Observable.timer(this.WAITTIME);
      this.resetChangeUserVotingSubscription = this.resetChangeUserVotingTimer
        .subscribe(t => {
          this.changeUserVoting.emit(this.USERVOTING);
          this.isFirstVote = true;
        });
      this.isFirstVote = false;
    }
    // perform up or downvote
    this.httpService.patchSongById(token, songId, route, this.userId)
      .then(user => {
        this.notifyUser.emit(new NotifyMessage(true, `Song successfully ${route}d!`)); 
        this.changeUserVoting.emit(user.availableVotes);
      })
      .catch(error => this.notifyUser.emit(error));
  }

  /**
   * CREATE NEW SONG
   */
  private sendNewSong (songTitle: HTMLInputElement, songArtist: HTMLInputElement): void {
    let title = songTitle.value;
    let artist = songArtist.value;

    if (title.length <= 0) {
      title = "unknown";
    }
    if (artist.length <= 0) {
      artist = "unknown";
    }
    if (title === "unknown" && artist === "unknown") {
      this.notifyUser.emit(new NotifyMessage(false, "Both parts are unknown! This is not legit!"));
      return;
    }

    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(tokenItem => {
        this.httpService.createSongByEventId(tokenItem.value, this.pickedEventId, {artist: artist, title: title})
          .then(msg => {
            this.notifyUser.emit(msg);
            songTitle.value = null;
            songArtist.value = null;
          })
          .catch(error => this.notifyUser.emit(error));
      })
      .catch(error => this.notifyUser.emit(error));
  }

  /**
   * CLEAR DATA - PUBLIC
   */
  clearData (): void {
    this.deejays = null;
    this.events = null;
    this.songs = null;
    this.pickedEventId = null;
    this.switchContentAreas("clear");
  }

  /**
   * NO AUTH - PUBLIC
   */
  showNoAuthView (): void {
    this.switchContentAreas("noauth");
  }
}
