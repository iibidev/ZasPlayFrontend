import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Room } from '../models/room.model';
import { env } from '../../environments/environment';
import { SocketService } from './socket-service';
import { UserService } from './user-service';
import { Game } from '../models/game.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class RoomService {

  private http = inject(HttpClient);
  socket = inject(SocketService).socket;
  private user = inject(UserService).user;
  constructor() { }

  getRooms(gameRoute: string): Observable<any>{
    return this.http.get<any>(env.BACKURL + "/room/" + gameRoute, { withCredentials: true });
  }

  joinRoom(roomCode: string): any{
    this.socket.emit("joinRoom", { roomCode, user: this.user() });
  }

  createRoom(game: Game): any{
    this.socket.emit("createRoom", { game, user: this.user() });
  }

  roomCreated(): Observable<string>{
    return new Observable<string>(observable =>{
      this.socket.on("roomCreated", (roomCode: string)=>{
        observable.next(roomCode);
      });
    })
  }

  someoneRoomCreated(): Observable<Room>{
    return new Observable<Room>(observable =>{
      this.socket.on("someoneRoomCreated", (room: Room)=>{
        observable.next(room);
      });
    })
  }

  failJoin(): Observable<any>{
    return new Observable(observable =>{
      this.socket.on("failedJoinToRoom", (msg)=>{
        observable.next(msg);
      });
    })
  }

  userJoined(): Observable<User>{
    return new Observable<User>(observable =>{
      this.socket.on("userJoined", (user: User)=>{
        observable.next(user);
      });
    })
  }

  joinedToRoom(): Observable<Room>{
    return new Observable<Room>(observable =>{
      this.socket.on("joinedToRoom", (room: Room)=>{
        observable.next(room);
      });
    })
  }
}
