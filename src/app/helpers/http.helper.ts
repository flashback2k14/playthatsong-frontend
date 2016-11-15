import { Injectable } from "@angular/core";


@Injectable()
export class HttpHelper {

  getBaseUrl (): string {
    return window.location.hostname === "localhost" ? "http://localhost:5005" : null;
  }
}