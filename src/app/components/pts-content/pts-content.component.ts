import { Component, Output, EventEmitter, ViewChild } from "@angular/core";

import { UserService } from "./../../services/user.service";
import { StorageService } from "./../../services/storage.service";

import { User } from "./../../models/user";
import { NotifyMessage } from "./../../models/notify-message";  


@Component({
  selector: 'pts-content',
  templateUrl: './pts-content.component.html',
  styleUrls: ['./pts-content.component.css']
})

export class PtsContentComponent {
  @Output() notifyUser: EventEmitter<NotifyMessage>;

  private deejays: User[];

  constructor (
    private userService: UserService,
    private storageService: StorageService
  ) { 
    this.notifyUser = new EventEmitter<NotifyMessage>();
  }

  loadData (): void {
    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(tokenItem => {
        this.userService.getDeejays(tokenItem.value)
          .then(data => this.deejays = data)
          .catch(error => this.notifyUser.emit(error));
      })
      .catch(error => this.notifyUser.emit(error));
  }

  clearData(): void {
    this.deejays = null;
  }
}
