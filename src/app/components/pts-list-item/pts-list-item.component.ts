import { Component, Input, OnInit } from '@angular/core';
import { User } from "./../../models/user";


@Component({
  selector: 'pts-list-item',
  templateUrl: './pts-list-item.component.html',
  styleUrls: ['./pts-list-item.component.css']
})
export class PtsListItemComponent implements OnInit {
  @Input() item: User;

  constructor() { }

  ngOnInit() { }

  private goToNextStep (item: User): void {
    alert(item._id);
  }
}
