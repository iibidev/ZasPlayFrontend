import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { Game } from '../models/game.model';
import { env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  private http = inject(HttpClient);
  allGames = signal<Game[] | null>(null);
  constructor() {
    this.getAll().subscribe({
      next: data =>{
        this.allGames.set(data);        
      },
      error: error =>{
        console.log(error);        
      }
    });
  }

  getTop(): Observable<Game[]>{
    return this.http.get<Game[]>(env.BACKURL + "/game/top", { withCredentials: true });
  }

  getGame(gameRoute: string): Observable<Game>{
    return this.http.get<Game>(env.BACKURL + "/game/get/" + gameRoute, { withCredentials: true });
  }

  getRandomGames(number: number): Observable<Game[]>{
    return this.http.get<Game[]>(env.BACKURL + "/game/randomGames/" + number, { withCredentials: true });
  }

  getGamesInDevelopment(): Observable<Game[]>{
    return this.http.get<Game[]>(env.BACKURL + "/game/inDevelopment", { withCredentials: true });
  }

  getAll(): Observable<Game[]>{
    return this.http.get<Game[]>(env.BACKURL + "/game/all", { withCredentials: true });
  }
}
