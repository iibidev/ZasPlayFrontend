import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { env } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  http = inject(HttpClient);

  myFriends(): Observable<User[]>{
    return this.http.get<User[]>(env.BACKURL + "/friend/myFriends", {
      withCredentials: true
    });
  }

  toggle(userId: string): Observable<any>{
    return this.http.get<any>(env.BACKURL + "/friend/toggle/" + userId,
       { withCredentials: true });
  }

  find(q: string): Observable<User[]>{
    return this.http.get<User[]>(env.BACKURL + "/friend/find?q=" + q,
       { withCredentials: true });
  }
}