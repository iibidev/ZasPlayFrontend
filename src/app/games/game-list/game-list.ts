import { Component, inject } from '@angular/core';
import { GameService } from '../../services/game-service';
import { Game } from '../../models/game.model';
import { GameCard } from "../../shared/game-card/game-card";
import { Loader } from "../../loader/loader";

@Component({
  selector: 'app-game-list',
  imports: [GameCard, Loader],
  templateUrl: './game-list.html',
  styleUrl: './game-list.css'
})
export class GameList {
  gameService = inject(GameService);
}
