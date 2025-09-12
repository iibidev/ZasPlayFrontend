import { Component, Input } from '@angular/core';
import { Game } from '../../models/game.model';
import { GameInfo } from "../game-info/game-info";

@Component({
  selector: 'app-game-card',
  imports: [GameInfo],
  templateUrl: './game-card.html',
  styleUrl: './game-card.css'
})
export class GameCard {
  @Input() game!: Game;
  showGameInfo: boolean = false;
}
