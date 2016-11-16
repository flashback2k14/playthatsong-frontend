import { Component, Output, EventEmitter, OnInit, ViewChild } from "@angular/core";

import { HttpService } from "./../../services/http.service";
import { StorageService } from "./../../services/storage.service";

import { User } from "./../../models/user";
import { Event } from "./../../models/event";
import { NotifyMessage } from "./../../models/notify-message";  


@Component({
  selector: 'pts-content',
  templateUrl: './pts-content.component.html',
  styleUrls: ['./pts-content.component.css']
})

export class PtsContentComponent implements OnInit {
  @Output() notifyUser: EventEmitter<NotifyMessage>;

  private showDeejayList: boolean;
  private showEventsList: boolean;

  private userToken: string;

  private deejays: User[];
  private events: Event[];

  constructor (
    private httpService: HttpService,
    private storageService: StorageService
  ) { 
    this.notifyUser = new EventEmitter<NotifyMessage>();
    this.showDeejayList = false;
    this.showEventsList = false;
  }

  ngOnInit () {
    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(tokenItem => this.userToken = tokenItem.value)
      .catch(error => this.notifyUser.emit(error));
  }

  private handleGoToEvents (dj: User): void {
    this.loadEventDataByDeejay(dj._id);
  }

  private loadEventDataByDeejay (deejayId: string): void {
    this.httpService.getEventsByDeejay(this.userToken, deejayId)
      .then(data => {
        this.events = data;
        this.switchContentAreas("events");
      })
      .catch(error => this.notifyUser.emit(error));
  }

  private switchContentAreas (area: string): void {
    switch (area) {
      case "deejay":
        this.showDeejayList = true;
        this.showEventsList = false;
        break;
      
      case "events":
        this.showDeejayList = false;
        this.showEventsList = true;
        break;

      case "songs":

        break;
      
      case "clear":
        this.showDeejayList = false;
        this.showEventsList = false;
        break;

      default:
        break;
    }
  }

  loadUserData (): void {
    this.httpService.getDeejays(this.userToken)
      .then(data => {
        this.deejays = data;
        this.switchContentAreas("deejay");
      })
      .catch(error => this.notifyUser.emit(error));
  }

  clearData(): void {
    this.deejays = null;
    this.events = null;
    this.switchContentAreas("clear");
  }
}
