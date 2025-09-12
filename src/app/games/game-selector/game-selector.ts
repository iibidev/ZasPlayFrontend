import { Component, ComponentRef, effect, EventEmitter, inject, Input, OnInit, Output, signal, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Rockpaperscissors } from '../rockpaperscissors/rockpaperscissors';
import { Room } from '../../models/room.model';
import { RoomService } from '../../services/room-service';
import { UserService } from '../../services/user-service';
import { FriendList } from "../../shared/friend-list/friend-list";
import { Tictactoe } from '../tictactoe/tictactoe';
import { Candytrap } from '../candytrap/candytrap';

@Component({
  selector: 'app-game-selector',
  imports: [FriendList],
  templateUrl: './game-selector.html',
  styleUrl: './game-selector.css'
})
export class GameSelector implements OnInit{
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private vcr = inject(ViewContainerRef);
  private componentRef!: ComponentRef<any>;
  roomService = inject(RoomService);
  userService = inject(UserService);
  is_waiting = signal(true);
  is_host: boolean = false;
  showInvite: boolean = false;
  @Input() room!: Room;

  private componenteMapa: Record<string, any> = {
    'rock-paper-scissors': Rockpaperscissors,
    'tictactoe': Tictactoe,
    'candy-trap': Candytrap
  };

  constructor(){
    effect(() =>{
      const waiting = this.is_waiting();
      if(!waiting){
        const game = this.componenteMapa[this.room.game.route || ''];
    
        if (game) {
          this.componentRef = this.vcr.createComponent(game);
          this.componentRef.instance.room = this.room;
          this.componentRef.instance.backToRoom.subscribe(() =>{
            this.componentRef.destroy();
            this.is_waiting.set(true);            
          });
        } else {
          console.error(`No se encontró componente para el tipo: ${ this.room.game.route }`);
        }
      }
    });
  }

  ngOnInit(): void {
    this.is_host = this.room.players[0].user._id == this.userService.user()?._id;
    
    this.roomService.userJoined().subscribe(user =>{
      this.room.players.push({
        user,
        host: false
      });

      if(this.room.players.length >= this.room.game.max){
        this.showInvite = false;
      }
    });

    this.roomService.socket.on("roomLeft", ()=>{
      this.router.navigate(['/games/' + this.room.game.route + '/rooms']);
    });

    this.roomService.socket.on("userLeft", userId =>{
      this.room.players = this.room.players.filter(p => p.user._id != userId);
    });

    this.roomService.socket.on("gameStarted", () =>{
      this.is_waiting.set(false);
    });
  }

  exit(){
    this.roomService.socket.emit("leaveRoom", { roomCode: this.room.code });
  }

  kickOut(userId: string){
    this.roomService.socket.emit("kickOut", { code: this.room.code, userId });
  }

  start(){
    this.roomService.socket.emit("startGame", this.room.code);
  }

  goToRooms(){
    this.router.navigate(["/games"]);
  }
}
