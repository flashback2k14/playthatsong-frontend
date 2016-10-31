import { Injectable } from "@angular/core"
import { Http, Response } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { LoginData } from "../models/login-data";
import { NotifyMessage } from "../models/notify-message";


@Injectable()
export class AuthService {
  private baseUrl: string;

  constructor (private http: Http) {
    this.baseUrl = window.location.hostname === "localhost" ? "http://localhost:5005" : null;
  }

  login (username: string, password: string): Promise<LoginData> {
    let user = {
      name: username,
      password: password
    };
    
    return this.http
      .post(`${this.baseUrl}/api/v1/auth/login`, user)
      .toPromise()
      .then(this.extractData)
      .catch(this.extractError);
  }

  private extractData (res: Response) {
    let data: LoginData = res.json();
    return data || { };
  }

  private extractError (res: Response) {
    let error: NotifyMessage = res.json();
    return Promise.reject(error || { });
  }
}