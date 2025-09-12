import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '../../environments/environment';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  user = signal<User | null>(null);
  
  constructor(){
    this.http.get<string>(env.BACKURL + "/auth/get-cookie", { withCredentials: true }).subscribe({
      next: token =>{
        if(token){
          localStorage.setItem("token", token);
          this.http.get(env.BACKURL + "/auth/myInfo", { withCredentials: true }).subscribe({
            next: (data: any) =>{
              if(data.ok){
                this.user.set(data.user);
              }
            },
            error: err =>{
              console.log(err);
            }
          });
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
