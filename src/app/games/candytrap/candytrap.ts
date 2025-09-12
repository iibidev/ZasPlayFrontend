import { Component, EventEmitter, inject, Input, OnInit } from '@angular/core';
import { SocketService } from '../../services/socket-service';
import { Room } from '../../models/room.model';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user-service';
import { getSafeCandyMessage, getOpponentSafeCandyMessage, getLoseCandyMessage, getOpponentLoseCandyMessage } from "./messages";
import { Loader2 } from "../../shared/loader2/loader2";

@Component({
  selector: 'app-candytrap',
  imports: [Loader2],
  templateUrl: './candytrap.html',
  styleUrl: './candytrap.css'
})
export class Candytrap implements OnInit{
  @Input() room!: Room;
  private backToRoom = new EventEmitter();
  private socket = inject(SocketService).socket;

  Candy = {
    eaten: false,
    poison: false,
    who: null
  }
  me: User | null = inject(UserService).user();
  opponent!: User;
  candies: any[] = Array(25).fill(this.Candy);
  gamePhase: number = 0; //0 players have to poison a candy, 1 players eat candies
  is_myTurn: boolean = false;
  host!: User;
  poisonedACandy: boolean = false;
  eatenCandy = {
    num: 0,
    poisoned: false,
    by: ""
  }
  showEatCandyAnimation: boolean = false;
  eatenSafeCandyMessage: string = "";
  eatenPoisonedCandyMessage: string = "";

  ngOnInit(): void {
    this.opponent = this.room.players.find(p => p.user._id != this.me!._id)!.user;
    this.host = this.room.players.find(p => p.host === true)!.user;

    this.socket.on("ct-update-candies", ({updatedCandies, poisonedCandyEaten, userId, position})=>{
      this.candies = updatedCandies;
      
      if(this.gamePhase === 1){
        this.showEatCandyAnimation = true;
        this.eatenCandy.num = position;

        if(userId == this.me!._id){
          this.eatenCandy.by = "me";
          this.eatenSafeCandyMessage = getSafeCandyMessage();   
          this.eatenPoisonedCandyMessage = getLoseCandyMessage();    
        } else{
          this.eatenCandy.by = "opponent"; 
          this.eatenSafeCandyMessage = getOpponentSafeCandyMessage(this.opponent.username);   
          this.eatenPoisonedCandyMessage = getOpponentLoseCandyMessage(this.opponent.username);
        }  

        if(poisonedCandyEaten){
          this.eatenCandy.poisoned = true;
          setTimeout(()=>{
            this.backToRoom.emit();
          }, 6500);
        }else{
          setTimeout(()=>{
            this.showEatCandyAnimation = false;
            this.is_myTurn = !this.is_myTurn;
          }, 5000);
        }
      }     
    });
    
    this.socket.on("ct-start", ()=>{
      this.gamePhase = 1;
      if(this.host._id == this.me!._id){
        this.socket.emit("firstTurn", { room: this.room });
      }
    });

    this.socket.on("whoStarts", (user: User) =>{
      if(user._id == this.me!._id) this.is_myTurn = true;    
    });
  }

  eatCandy(position: number){
    if(this.gamePhase === 0 && !this.poisonedACandy){
      this.poisonedACandy = true;
      this.socket.emit("ct-poison-a-candy", { room: this.room, candies: this.candies, position, userId: this.me!._id });
    }else{
      if(this.is_myTurn){
        const alreadyEaten = this.candies[position].eaten == true;
        if(!alreadyEaten){
          this.socket.emit("ct-eat-candy", { room: this.room, candies: this.candies, position, userId: this.me!._id });
        }
      }
    }
  }
}
