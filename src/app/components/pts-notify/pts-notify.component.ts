import { NotifyMessage } from "./../../models/notify-message";
import { Component, ViewChild, AfterViewInit } from '@angular/core';


@Component({
  selector: 'pts-notify',
  templateUrl: './pts-notify.component.html',
  styleUrls: ['./pts-notify.component.css']
})

export class PtsNotifyComponent implements AfterViewInit {
  @ViewChild("snackbarContainer") snackbarContainer;
  private neSnackbarContainer: any;
  private isErrorMessage: boolean = false;

  ngAfterViewInit() {
    this.neSnackbarContainer = this.snackbarContainer.nativeElement;
    if(!(typeof(componentHandler) == 'undefined')){
      componentHandler.upgradeAllRegistered();
    }
  }

  showMessage (isError: boolean, msg: string): void {
    this.isErrorMessage = !isError;
    this.neSnackbarContainer.MaterialSnackbar.showSnackbar({message: msg});
  }
}
