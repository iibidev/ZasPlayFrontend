import { Component, EventEmitter, inject, Input, OnInit } from '@angular/core';
import { Room } from '../../models/room.model';
import { SocketService } from '../../services/socket-service';
import { UserService } from '../../services/user-service';
import { User } from '../../models/user.model';

import confetti from 'canvas-confetti';
import { GameStat } from '../../models/gameStat.model';
import { Loader2 } from "../../shared/loader2/loader2";

@Component({
  selector: 'app-tictactoe',
  imports: [Loader2],
  templateUrl: './tictactoe.html',
  styleUrl: './tictactoe.css'
})
export class Tictactoe implements OnInit{
  @Input() room!: Room;
  private backToRoom = new EventEmitter();
  private socket = inject(SocketService).socket;

  me = inject(UserService).user();
  otherPlayer !: User;
  gamePhase: number = 0;
  is_myTurn: boolean = false;
  myIcon !: string;
  otherPlayersIcon !: string;
  animationTurnPlayer: User = this.me!;
  currentTurn!: User;
  board: string[] = [
    "", "", "",
    "", "", "",
    "", "", "",
  ];
  gameFinished: boolean = false;
  finishStatus!: string;
  myStats!: GameStat;

  defaults = {
    spread: 360,
    ticks: 50,
    gravity: 0,
    decay: 0.94,
    startVelocity: 30,
    shapes: ["star"],
    colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
  };

  ngOnInit(): void {
    this.firstTurnAnimation();

    this.otherPlayer = this.room.players.find(p => p.user._id != this.me?._id)!.user;
    const host = this.room.players.find(p => p.host === true)!.user;
    if(host._id == this.me!._id) {
      this.socket.emit("firstTurn", {room: this.room});
      this.myIcon = "x";
      this.otherPlayersIcon = "o";
    }else{
      this.myIcon = "o";
      this.otherPlayersIcon = "x";
    }
    
    this.socket.on("whoStarts", (user: User)=>{
      setTimeout(()=>{
        this.currentTurn = user;
        this.is_myTurn = this.currentTurn._id == this.me?._id;
        this.shoot();
        setTimeout(()=>{
          this.gamePhase = 1;
        }, 5200);
      }, 3500);
    });

    this.socket.on("tic-boardUpdate", (updatedBoard)=>{
      this.board = updatedBoard;
      this.is_myTurn = !this.is_myTurn;
    });

    this.socket.on("tic-draw", (stat: GameStat)=>{
      this.finished("d", stat);
    });

    this.socket.on("tic-win", (stat: GameStat)=>{
      this.finished("w", stat);
    });

    this.socket.on("tic-lost", (stat: GameStat)=>{
      this.finished("l", stat);
    });
  }

  finished(status: string, stat: GameStat){
    this.is_myTurn = false;
    this.gameFinished = true;
    this.finishStatus = status;
    this.myStats = stat;
    setTimeout(()=>{
      this.backToRoom.emit();
    }, 4500);
  }

  makePlay(position: number){
    const canPlay = this.board[position] == "" && this.is_myTurn;

    if (canPlay){
      const play = {
        icon: this.myIcon,
        position
      }
      
      this.socket.emit("tic-makePlay", { 
        room: this.room, 
        board: this.board,
        play
      });
    }
  }

  firstTurnAnimation(){
    let count = 0;

    const anim = setInterval(()=>{
      this.animationTurnPlayer = this.room.players[count % 2].user;
      count++;

      if(this.currentTurn) clearInterval(anim);
    }, 200);
  }

  shoot() {
    confetti({
      ...this.defaults,
      particleCount: 40,
      scalar: 1.2,
      shapes: ["star"],
    });

    confetti({
      ...this.defaults,
      particleCount: 10,
      scalar: 0.75,
      shapes: ["circle"],
    });
  }
}

