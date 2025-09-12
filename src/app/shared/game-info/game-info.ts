import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Game } from '../../models/game.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-game-info',
  imports: [RouterLink],
  templateUrl: './game-info.html',
  styleUrl: './game-info.css'
})
export class GameInfo {

  @Input() game!: Game;
  @Output() cerrar = new EventEmitter();

  cerrarInfo(){
    this.cerrar.emit();
  }
}
