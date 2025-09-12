import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FriendService } from '../../services/friend-service';
import { User } from '../../models/user.model';
import { Loader2 } from "../loader2/loader2";
import { FormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket-service';
import { UserService } from '../../services/user-service';
import { Room } from '../../models/room.model';

@Component({
  selector: 'app-friend-list',
  imports: [RouterLink, Loader2, FormsModule],
  templateUrl: './friend-list.html',
  styleUrl: './friend-list.css'
})
export class FriendList implements OnInit{
  @Output() cerrar = new EventEmitter();
  friendService = inject(FriendService);
  userService = inject(UserService);
  socket = inject(SocketService).socket;
  friends!: User[];
  users!: User[];
  showFriends: boolean = true;
  searching: boolean = false;
  query: string = "";
  addingFriend: boolean = false;
  @Input() mode: number = 1;
  @Input() room!: Room;

  ngOnInit(): void {
    this.friendService.myFriends().subscribe({
      next: (data: any) =>{                   
        this.friends = data;
      },
      error: err =>{
        console.log(err.error);
      }
    });
  }

  inviteUser(userId: string, btn: HTMLButtonElement){
    if(!btn.disabled){
      btn.innerHTML = "Invitado";
      btn.disabled = true;
      this.socket.emit("sendInvite", { sender: this.userService.user(), room: this.room, receiver: userId });
      setTimeout(() =>{
        btn.innerHTML = "Invitar";
        btn.disabled = false;
      }, 4000);
    }
  }

  addFriend(userId: string){
    this.addingFriend = true;
    this.friendService.toggle(userId).subscribe({
      next: data =>{        
        const addedUser = this.users.find(u => u._id == userId);
        if(addedUser){
          addedUser.is_friend = data;
          this.friends.unshift(addedUser);
          this.addingFriend = false;
        }
      },
      error: err =>{
        console.log(err.error);
        this.addingFriend = false;
      }
    })
  }

  findUsers(){
    if(this.query.trim() != ""){
      this.showFriends = false;
      this.searching = true;
      this.friendService.find(this.query).subscribe({
        next: data =>{                    
          this.users = data;
          this.searching = false;
        },
        error: err =>{
          console.log(err.error);
          this.searching = false;
        }
      });
      return;
    }
    this.showFriends = true;
  }

  cerrarLista(){
    this.cerrar.emit();
  }
}
