import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs/Subscription";

import { UserService } from "./../../services/user.service";
import { StorageService } from "./../../services/storage.service";
import { FuckRouterOutletService } from "./../../services/fuckrouteroutlet.service";

import { User } from "./../../models/user";


@Component({
  selector: 'pts-content',
  templateUrl: './pts-content.component.html',
  styleUrls: ['./pts-content.component.css']
})

export class PtsContentComponent implements OnInit, OnDestroy {
  @ViewChild("ptsNotify") ptsNotify;
  
  private deejays: User[];
  private loadDataSubscription: Subscription;
  private clearDataSubscription: Subscription;

  constructor (
    private userService: UserService,
    private storageService: StorageService,
    private fuckRouterOutletService: FuckRouterOutletService
  ) { 
    console.log("PtsContentComponent - constructor");
    this.loadDataSubscription = this.fuckRouterOutletService
                                  .loadUserComponentData$.subscribe(() => {
                                    this.loadData();
                                  });
    this.clearDataSubscription = this.fuckRouterOutletService
                                  .clearUserComponentData$.subscribe(() => {
                                    this.clearData();
                                  });
  }

  ngOnInit () {
    console.log("PtsContentComponent - ngOnInit");
    this.loadData();
  }

  ngOnDestroy () {
    console.log("PtsContentComponent - ngOnDestroy");
    this.loadDataSubscription.unsubscribe();
    this.clearDataSubscription.unsubscribe();
  }

  loadData (): void {
    this.storageService.getOne(this.storageService.TOKENKEY)
      .then(tokenItem => {
        this.userService.getDeejays("tokenItem.value")
          .then(data => this.deejays = data)
          .catch(error => {
            this.ptsNotify.showMessage(error.success, error.message);
          });
      })
      .catch(error => {
        this.ptsNotify.showMessage(error.success, error.message);
      });
  }

  clearData(): void {
    this.deejays = null;
  }
}
