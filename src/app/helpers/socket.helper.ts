import { Injectable } from "@angular/core";
import * as io from "socket.io-client";
import { HttpHelper } from "./http.helper";


@Injectable()
export class SocketHelper {
  private socket: SocketIOClient.Socket;

  constructor (private httpHelper: HttpHelper) { 
    this.socket = io(this.httpHelper.getBaseUrl());
  }

  getSocket (): SocketIOClient.Socket {
    return this.socket;
  }
}