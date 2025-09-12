import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '../../environments/environment';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { SocketService } from './socket-service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private socketService = inject(SocketService);
  user = signal<User | null>(null);
  
  constructor(){
    this.http.get(env.BACKURL + "/auth/myInfo", { withCredentials: true }).subscribe({
      next: (data: any) =>{
        if(data.ok){
          this.user.set(data.user);
        }
      },
      error: err =>{
        console.log(err);
        window.location.href = env.BACKURL + "/auth/login";
      }
    });
  }

  getProfile(id: string): Observable<Profile>{
    return this.http.get<Profile>(env.BACKURL + "/auth/profile/" + id, { withCredentials: true });
  }
}
