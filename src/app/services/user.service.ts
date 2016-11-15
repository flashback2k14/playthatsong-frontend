import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { HttpHelper } from "./../helpers/http.helper";
import { User } from "./../models/user";
import { NotifyMessage } from "./../models/notify-message";

@Injectable()
export class UserService {
  private baseUrl: string;

  constructor (
    private httpHelper: HttpHelper,
    private http: Http
  ) {
    this.baseUrl = this.httpHelper.getBaseUrl();
  }

  getDeejays (token: string): Promise<User[]> {
    let header = new Headers();
    header.append("x-access-token", token);
    header.append("Content-Type", "application/json");

    return this.http
      .get(`${this.baseUrl}/api/v1/users?flag=dj`, { headers: header })
      .toPromise()
      .then(this.extractData)
      .catch(this.extractError);
  }

  private extractData (res: Response): User[] {
    let data: User[] = res.json().users;
    return data || [];
  }

  private extractError (res: Response): Promise<NotifyMessage> {
    let error: NotifyMessage = res.json();
    return Promise.reject(error || { });
  }
}