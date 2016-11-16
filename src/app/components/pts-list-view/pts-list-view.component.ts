import { Component, Input } from '@angular/core';
import { User } from "./../../models/user";

@Component({
  selector: 'pts-list-view',
  templateUrl: './pts-list-view.component.html',
  styleUrls: ['./pts-list-view.component.css']
})
export class PtsListViewComponent {
  @Input() items: User[];
}
