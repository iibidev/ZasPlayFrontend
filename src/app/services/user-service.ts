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

  getUserinfo(){
    this.http.get(env.BACKURL + "/auth/myInfo", { withCredentials: true }).subscribe({
      next: (data: any) =>{
        if(data.ok){
          this.user.set(data.user);
        }
      },
      error: err =>{
        console.log(err);
        localStorage.removeItem("token");
        this.router.navigate(["login"]);
      }
    });
  }

  updateAvatar(avatar: string): Observable<any>{
    return this.http.put(env.BACKURL + "/auth/updateAvatar", { avatar });
  }

  updateProfilePic(formData: FormData): Observable<any>{
    return this.http.put(env.BACKURL + "/auth/updatePic", formData);
  }

  updateUser(username: string): Observable<any>{
    return this.http.put(env.BACKURL + "/auth/update", { username });
  }

  getProfile(id: string): Observable<Profile>{
    return this.http.get<Profile>(env.BACKURL + "/auth/profile/" + id, { withCredentials: true });
  }
}
