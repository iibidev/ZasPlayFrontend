import { AfterViewChecked, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { GameService } from '../services/game-service';
import { Game } from '../models/game.model';
import { Loader } from "../loader/loader";
import { GameInfo } from "../shared/game-info/game-info";
import { GameCard } from "../shared/game-card/game-card";

@Component({
  selector: 'app-home',
  imports: [Loader, GameInfo, GameCard],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, AfterViewChecked{

  gameService = inject(GameService);
  bannerGames!: Game[];
  topGames!: any[];
  gamesInDevelopment: Game[] = [];
  selectedGame!: Game;
  showGameInfo: boolean = false;
  checkBanner: boolean = false;
  @ViewChild("banner") bannerRef!: ElementRef<HTMLElement>;

  ngAfterViewChecked(): void {
    if (this.bannerRef && !this.checkBanner) {
      this.checkBanner = true;
      const banner = this.bannerRef.nativeElement;
      
      setInterval(() =>{
        if(banner.scrollLeft >= banner.scrollWidth - banner.offsetWidth){
          banner.scrollLeft = 0;
        }else{
          banner.scrollLeft = banner.scrollLeft + banner.offsetWidth;
        }        
      }, 6000);
      
    }
  }

  ngOnInit(): void {
    this.gameService.getRandomGames(4).subscribe({
      next: data =>{
        this.bannerGames = data;
        
      },
      error: error =>{
        console.log(error.error);
      }
    });

    this.gameService.getTop().subscribe({
      next: data =>{
        this.topGames = data;
        const missing = 5 - this.topGames.length;
        this.topGames = [...this.topGames, ...Array(missing).fill(null)];
        
      },
      error: error =>{
        console.log(error);
      }
    });
    
    this.gameService.getGamesInDevelopment().subscribe({
      next: data =>{
        this.gamesInDevelopment = data;
      },
      error: error =>{
        console.log(error);
        
      }
    });
  }

  seeInfo(game: Game){
    this.selectedGame = game;
    this.showGameInfo = true;
  }
}
