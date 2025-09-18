import { Component, effect, inject, OnChanges, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterEvent, RouterLink, RouterOutlet } from '@angular/router';
import { Header } from "./shared/header/header";
import { UserService } from './services/user-service';
import { filter } from 'rxjs';
import { SocketService } from './services/socket-service';
import { Invitation } from './models/invitation.model';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  userService = inject(UserService);
  router = inject(Router);
  socketService = inject(SocketService);
  showHeader: boolean = true;
  currentUrl!: string;
  invitations: Invitation[] = [];
  notiAudio?: HTMLAudioElement;

  constructor(){
    effect(()=>{
      const userId = this.userService.user()?._id;      
      if(userId) this.socketService.socket.emit("joinChannel", userId);
    })
  }

  ngOnInit(): void {
    window.addEventListener('click', this.initAudioOnce, { once: true });

    this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe(event =>{
      this.currentUrl = event.url;

      if(this.currentUrl.includes("/games/") || this.currentUrl.includes("/login") || this.currentUrl.includes("/register")){
        this.showHeader = false;
      }else{
        this.showHeader = true;
      }
      
    });

    this.socketService.socket.on("receiveInvitation", (inv: Invitation) =>{      
      if(!this.currentUrl.includes("/rooms/")){
        this.invitations.push(inv);

        if (this.notiAudio) {
          this.notiAudio.currentTime = 0;
          this.notiAudio.play().catch(err => {
            console.warn("No se pudo reproducir audio:", err);
          });
        }
        
        setTimeout(()=>{
          const invitation = document.getElementById(inv.sender._id) as HTMLElement;
          const animation = invitation.animate([
            { opacity: 1 },
            { opacity: 0 }
          ],{
            duration: 400,
            easing: "ease-in",
            fill: "forwards"
          });

          animation.finished.then(() => {
            this.invitations.shift();
          });
        }, 4000);
        }
    });
  }

  initAudioOnce = () => {
    this.notiAudio = new Audio("invitation.mp3");
  };
}
