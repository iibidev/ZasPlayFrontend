import { Component, inject, OnInit, Signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { env } from '../../../environments/environment';
import { UserService } from '../../services/user-service';
import { FriendList } from "../friend-list/friend-list";

@Component({
  selector: 'app-header',
  imports: [RouterLink, FriendList],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header{
  mostrarMenu: boolean = false;
  loginURL: string = env.BACKURL + "/auth/login";
  userService = inject(UserService);
  mostrarAmigos: boolean = false;

  cerrarMenu(menu: HTMLElement){
    const animation = menu.animate(
      [
        { right: 0 },
        { right: '-100%' }
      ],
      {
        duration: 400,
        easing: 'ease-in',
        fill: "forwards"
      }
    );

    animation.finished.then(() =>{
      this.mostrarMenu = false;
    })
  }
}
