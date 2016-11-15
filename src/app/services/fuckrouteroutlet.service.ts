import { Injectable } from "@angular/core";
import { Subject } from "rxjs/Subject";
import { Observable } from "rxjs/Observable";


@Injectable()
export class FuckRouterOutletService {
  private loadUserComponentDataSource = new Subject<void>();
  private clearUserComponentDataSource = new Subject<void>();

  loadUserComponentData$ = this.loadUserComponentDataSource.asObservable();
  clearUserComponentData$ = this.clearUserComponentDataSource.asObservable();

  loadUserComponentData (): void {
    this.loadUserComponentDataSource.next();
  }

  clearUserComponentData (): void {
    this.clearUserComponentDataSource.next();
  }
}