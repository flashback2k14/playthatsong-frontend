import { Injectable } from "@angular/core";
import { User } from "./../models/user";


@Injectable()
export class AuthHelper {

  isLoginExpired (expires: number): boolean {
    return (Math.round(Date.now() / 1000) >= expires);
  }

  convertUserToString (user: User): string {
    return JSON.stringify(user);
  }

  convertStringToUser (strUser: string): User {
    return JSON.parse(strUser) as User;
  }
}