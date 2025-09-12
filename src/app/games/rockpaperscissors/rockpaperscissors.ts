import { Component, EventEmitter, inject, Input, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import { SocketService } from '../../services/socket-service';
import { UserService } from '../../services/user-service';
import { Player } from '../../models/player.model';
import JSConfetti from 'js-confetti';

@Component({
  selector: 'app-rockpaperscissors',
  imports: [],
  templateUrl: './rockpaperscissors.html',
  styleUrl: './rockpaperscissors.css'
})
export class Rockpaperscissors implements OnInit{
  private jsConfetti = new JSConfetti();
  otherPlayer!: Player | undefined;
  otherPlayersPlay!: number;
  @Input() room!: Room;
  otherPlayerReady: boolean = false;
  playSelected: boolean = false;
  myPlay!: number;
  socketService = inject(SocketService);
  userService = inject(UserService);
  gamePhase: number = 0; //Phases of the game, 0 -> selection, 1 -> game, 2 -> start again
  result!: number;
  private backToRoom = new EventEmitter();

  ngOnInit(): void {
    this.otherPlayer = this.room.players.find(p => p.user._id != this.userService.user()!._id);
    this.socketService.socket.on("otherPlayerPlayed", ({ player, play })=>{
      this.otherPlayerReady = true;
      this.otherPlayersPlay = play;
    });

    this.socketService.socket.on("draw", ()=>{
      this.gamePhase = 1;
      this.otherPlayersPlay = this.myPlay;
      this.showResult(0);
    });

    this.socketService.socket.on("winner", (play)=>{
      this.gamePhase = 1;
      this.otherPlayersPlay = play;
      this.showResult(1);  
    });

    this.socketService.socket.on("looser", (play)=>{
      this.gamePhase = 1;
      this.otherPlayersPlay = play;
      this.showResult(2);
    });
  }

  makePlay(play: number){
    this.playSelected = true;
    this.myPlay = play;
    if(!this.otherPlayerReady){
      this.socketService.socket.emit("play", { room: this.room.code, player: this.userService.user()?._id, play });
    }else{
      this.socketService.socket.emit("checkWinner", { 
          gameId: this.room.game._id,
          room: this.room.code, 
          play1: {
            player: this.userService.user()?._id,
            play
          },
          play2: {
              player: this.otherPlayer?.user._id,
              play: this.otherPlayersPlay
          }
        }
      );
    }
  }
 
  showResult(r: number){
    this.result = r;
    let count = 0;
    setTimeout(()=>{
      this.gamePhase = 2;
      if(this.result == 1){
        const intervalo = setInterval(() => {
          this.jsConfetti.addConfetti({
            confettiColors: ['#ff0a54', '#ff477e', '#ff7096', '#ff85a1', '#fbb1bd', '#f9bec7', '#fcd5ce', '#cdb4db', '#b5ead7'],
            confettiNumber: 70
          });
          count++;

          if (count === 4) {
            clearInterval(intervalo);
          }
        }, 500);
      }

      setTimeout(()=>{
        this.backToRoom.emit();
      }, 3500);
    }, 2000);
  }
}