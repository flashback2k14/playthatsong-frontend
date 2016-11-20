import { Injectable } from "@angular/core";
import { Headers, Response } from "@angular/http";

import { User } from "./../models/user";
import { Event } from "./../models/event";
import { Song } from "./../models/song";
import { NotifyMessage } from "./../models/notify-message";


@Injectable()
export class HttpHelper {

  getBaseUrl (): string {
    return window.location.hostname === "localhost" ? "http://localhost:5005" : null;
  }

  getRequestHeader (token: string): Headers {
    let header = new Headers();
    header.append("x-access-token", token);
    header.append("Content-Type", "application/json");
    return header;
  }

  extractUserData (res: Response): User[] {
    let data: User[] = res.json().users;
    return data || [];
  }

  extractEventsData (res: Response): Event[] {
    let data: Event[] = res.json().events;
    return data || [];
  }

  extractSongsData (res: Response): Song[] {
    let data: Song[] = res.json().songs;
    return data || [];
  }

  extractPatchData (res: Response): User {
    let data: User = res.json().updatedUser;
    return data || { } as User;
  }

  extractError (res: Response): Promise<NotifyMessage> {
    let error: NotifyMessage = res.json();
    return Promise.reject(error || { });
  }
}