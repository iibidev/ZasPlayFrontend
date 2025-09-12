import { Injectable } from '@angular/core';
import { env } from '../../environments/environment';
import { io, Socket } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  socket: Socket;

  constructor() {
    this.socket = io(env.BACKURL, {
      transports: ['websocket'],
    });
  }
}
