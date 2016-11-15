import { Injectable } from "@angular/core"
import { Http, Response } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { HttpHelper } from "./../helpers/http.helper";

import { LoginData } from "../models/login-data";
import { RegisterData } from "./../models/register-data";
import { NotifyMessage } from "../models/notify-message";


@Injectable()
export class AuthService {
  private baseUrl: string;

  constructor (
    private httpHelper: HttpHelper, 
    private http: Http
  ) {
    this.baseUrl = this.httpHelper.getBaseUrl();
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

  register (username: string, password: string): Promise<RegisterData> {
    let user = {
      name: username,
      password: password
    };
    
    return this.http
      .post(`${this.baseUrl}/api/v1/auth/reigster`, user)
      .toPromise()
      .then(this.extractRegisterData)
      .catch(this.extractError);
  }

  private extractData (res: Response) {
    let data: LoginData = res.json();
    return data || { };
  }

  private extractRegisterData (res: Response) {
    let data: RegisterData = res.json();
    return data || { };
  }

  private extractError (res: Response) {
    let error: NotifyMessage = res.json();
    return Promise.reject(error || { });
  }
}