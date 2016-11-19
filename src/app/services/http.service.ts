import { Injectable } from "@angular/core";
import { Http, Headers, Response } from "@angular/http";

import "rxjs/add/operator/toPromise";

import { HttpHelper } from "./../helpers/http.helper";

import { User } from "./../models/user";
import { Event } from "./../models/event";
import { Song } from "./../models/song";
import { NotifyMessage } from "./../models/notify-message";


@Injectable()
export class HttpService {
  private baseUrl: string;

  constructor (
    private httpHelper: HttpHelper,
    private http: Http
  ) {
    this.baseUrl = this.httpHelper.getBaseUrl();
  }

  getDeejays (token: string): Promise<User[]> {
    return this.http
      .get(`${this.baseUrl}/api/v1/users?flag=dj`, { headers: this.httpHelper.getRequestHeader(token) })
      .toPromise()
      .then(this.httpHelper.extractUserData)
      .catch(this.httpHelper.extractError);
  }

  getEventsByDeejay (token: string, deejayId: string): Promise<Event[]> {
    return this.http
      .get(`${this.baseUrl}/api/v1/events?dj=${deejayId}`, { headers: this.httpHelper.getRequestHeader(token) })
      .toPromise()
      .then(this.httpHelper.extractEventsData)
      .catch(this.httpHelper.extractError);
  }

  getSongsByEvent (token: string, eventId: string): Promise<Song[]> {
    return this.http
      .get(`${this.baseUrl}/api/v1/events/${eventId}/songs`, { headers: this.httpHelper.getRequestHeader(token) })
      .toPromise()
      .then(this.httpHelper.extractSongsData)
      .catch(this.httpHelper.extractError);
  }

  patchSongById (token: string, songId: string, route: string): Promise<NotifyMessage> {
    return this.http
      .patch(`${this.baseUrl}/api/v1/songs/${songId}/${route}`, null, { headers: this.httpHelper.getRequestHeader(token) })
      .toPromise()
      .then(() => new NotifyMessage(true, `Song successfully ${route}d!`))
      .catch(this.httpHelper.extractError);
  }

  createSongByEventId (token: string, eventId: string, body: any): Promise<NotifyMessage> {
    return this.http
      .post(`${this.baseUrl}/api/v1/events/${eventId}/songs`, body, { headers: this.httpHelper.getRequestHeader(token) })
      .toPromise()
      .then(() => new NotifyMessage(true, "Song successfully saved!"))
      .catch(this.httpHelper.extractError);
  }
}