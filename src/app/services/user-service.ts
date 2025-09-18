import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { env } from '../../environments/environment';
import { User } from '../models/user.model';
import { Observable } from 'rxjs';
import { Profile } from '../models/profile.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private router = inject(Router);
  user = signal<User | null>(null);
  
  constructor(){
    if(localStorage.getItem("token")){
      this.getUserinfo();
    }else{
      this.router.navigate(["login"]);
    }
    
  }

  goEditProfile(){
    this.http.post(env.BACKURL + "/auth/edit", ({ userId: this.user()!._id, token: localStorage.getItem("token") })).subscribe({
      next: data =>{

      },
      error: err =>{
        console.log(err);
        
      }
    });
  }

  getUserinfo(){
    this.http.get(env.BACKURL + "/auth/myInfo", { withCredentials: true }).subscribe({
      next: (data: any) =>{
        if(data.ok){
          this.user.set(data.user);
        }
      },
      error: err =>{
        console.log(err);
        this.router.navigate(["login"]);
      }
    });
  }

  getProfile(id: string): Observable<Profile>{
    return this.http.get<Profile>(env.BACKURL + "/auth/profile/" + id, { withCredentials: true });
  }
}
