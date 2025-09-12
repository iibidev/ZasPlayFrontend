import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../services/user-service';
import { ActivatedRoute } from '@angular/router';
import { Profile as ProfileModel} from '../models/profile.model';
import { DatePipe } from '@angular/common';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { Loader } from "../loader/loader";
import { FriendService } from '../services/friend-service';
import { Loader2 } from "../shared/loader2/loader2";
import { Title } from '@angular/platform-browser';
import { env } from '../../environments/environment';

registerLocaleData(localeEs);

@Component({
  selector: 'app-profile',
  imports: [DatePipe, Loader, Loader2],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit{

  userService = inject(UserService);
  friendService = inject(FriendService);
  activatedRoute = inject(ActivatedRoute);
  title = inject(Title);
  perfil!: ProfileModel;
  is_toggle: boolean = false;

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params =>{
      const id = params.get("id") || "";
      this.userService.getProfile(id).subscribe({
        next: data =>{                 
          this.perfil = data;
          this.title.setTitle(`ZasPlay - ${ this.perfil.user.username }`);
        },
        error: err =>{
          console.log(err.error);
        }
      });
    })
  }

  toggleFriend(){
    this.is_toggle = true;
    this.friendService.toggle(this.perfil.user._id).subscribe({
      next: data =>{
        this.perfil.friend = data.is_friend;
        this.is_toggle = false;
      },
      error: err =>{
        console.log(err.error);
        this.is_toggle = false;
      }
    });
  }

  logout(){
    window.location.href = env.BACKURL + "/auth/logout";
  }

  edit(){
    window.location.href = env.BACKURL + "/auth/edit";
  }
}
