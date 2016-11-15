import { Component, Input, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { User } from "./../../models/user";

@Component({
  selector: 'pts-deejay-list',
  templateUrl: './pts-deejay-list.component.html',
  styleUrls: ['./pts-deejay-list.component.css']
})
export class PtsDeejayListComponent implements OnInit {
  @Input() deejays: User[];

  constructor(private router: Router) { }

  ngOnInit() {}

  private goToDjEvents (dj: User): void {
    
  }
}
