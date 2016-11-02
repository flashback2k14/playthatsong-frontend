import { Injectable } from "@angular/core";


@Injectable()
export class AuthHelper {

  isLoginExpired (expires: number): boolean {
    return (Math.round(Date.now() / 1000) >= expires);
  }
}