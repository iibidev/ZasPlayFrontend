import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RoomService } from '../services/room-service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Game } from '../models/game.model';
import { Room } from '../models/room.model';
import { Loader } from "../loader/loader";
import { Loader2 } from "../shared/loader2/loader2";
import { GameSelector } from "../games/game-selector/game-selector";
import { GameService } from '../services/game-service';
import { UserService } from '../services/user-service';

@Component({
  selector: 'app-rooms',
  imports: [Loader, Loader2, RouterLink, GameSelector],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css'
})
export class Rooms implements OnInit{

  title = inject(Title);
  activatedRoute = inject(ActivatedRoute);
  router = inject(Router);
  roomService = inject(RoomService);
  gameService = inject(GameService);
  userService = inject(UserService);
  game!: Game;
  rooms!: Room[];
  showLoadingScreen: boolean = true;
  gameRoute!: string;
  roomCode: string = "";
  joiningToRoom = signal(false);
  errorMsg: string = "";
  roomInfo!: Room;
  gameBackground: string = "";

  constructor(){
    effect(()=>{
      if(this.joiningToRoom() && this.userService.user()){
        this.roomService.joinRoom(this.roomCode);
      }
    })
  }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      this.gameRoute = params.get("name") || "";
      this.roomCode = params.get("code") || "";

      this.gameService.getGame(this.gameRoute).subscribe({
        next: data =>{
          this.game = data;
          this.title.setTitle(`ZasPlay - ${ this.game.name }`);
          if(this.game.isInDevelopment && !this.userService.user()!.dev){
            this.gameBackground = this.game.background;
          }else if(!this.roomCode){
            this.gameBackground = this.game.thumbnail;
            this.getRooms();
          }else{
            this.joiningToRoom.set(true);
          }
        },
        error: err =>{
          console.log(err);
          this.router.navigate(["/games"]); 
        }
      });
    });

    this.roomService.socket.on("hostLeft", msg =>{
      this.errorMsg = msg;
      setTimeout(()=>{
        this.errorMsg = "";
        this.router.navigate(['/games/' + this.game.route + '/rooms']);
      }, 2000);
    });

    this.roomService.socket.on("kicked", msg =>{
      this.errorMsg = msg;
      setTimeout(()=>{
        this.errorMsg = "";
        this.router.navigate(['/games/' + this.game.route + '/rooms']);
      }, 2000);
    });

    this.roomService.socket.on("userJoinedToRoom", (room: Room) =>{
      if(this.rooms && this.game._id == room.game._id){
        const roomJoined = this.rooms.find(r => r.code == room.code);
        roomJoined!.players = room.players;
      }
    });

    this.roomService.socket.on("userLeftRoom", (room: any) =>{
      if(this.rooms && this.game._id == room.game){
        const roomJoined = this.rooms.find(r => r.code == room.code);
        roomJoined!.players = room.players;
      }
    });

    this.roomService.someoneRoomCreated().subscribe(newRoom =>{
      //Show only if the created room is from the same game
      if(this.rooms && newRoom.game._id == this.game._id){
        this.rooms.unshift(newRoom);
      }
    });

    this.roomService.failJoin().subscribe(msg =>{
      this.errorMsg = msg;
      setTimeout(()=>{
        this.errorMsg = ""; 
        this.router.navigate(["/games/" + this.game.route + "/rooms"]);
      }, 2000);
    });

    this.roomService.joinedToRoom().subscribe(room =>{
      this.roomInfo = room;
      this.showLoadingScreen = false;
      this.gameBackground = this.game.background;
    });

    this.roomService.roomCreated().subscribe(code =>{
      this.router.navigate([`/games/${ this.game.route }/rooms/${ code }`]);
    });

    this.roomService.socket.on("removeRoom", code=>{
      if (this.rooms) {
        this.rooms = this.rooms.filter(r => r.code !== code);
      }
    });
  }

  create(){
    this.roomService.createRoom(this.game);
  }

  getRooms(showLoading: boolean = true){
    this.roomService.getRooms(this.game.route).subscribe({
      next: data =>{
        this.rooms = data.rooms;
        if(showLoading){
          setTimeout(() =>{
            this.showLoadingScreen = false;
            this.gameBackground = this.game.background;
          }, 4000);
        }else{
          this.showLoadingScreen = false;
          this.gameBackground = this.game.background;
        }
      },
      error: err =>{
        console.log(err.error);            
      }
    }); 
  }
}
