import { Component, EventEmitter, inject, Output } from '@angular/core';
import { UserService } from '../../services/user-service';
import { Loader } from "../../loader/loader";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit',
  imports: [Loader, FormsModule],
  templateUrl: './edit.html',
  styleUrl: './edit.css'
})
export class Edit {

  userService = inject(UserService);
  @Output() goBack = new EventEmitter();
  usernameRegex = /^[a-zA-Z0-9_-]{4,16}$/;
  showPicOptions: boolean = false;
  showAvatars: boolean = false;
  showLoader: boolean = false;
  showError: boolean = false;
  errorMsg: string = "";

  selectedAvatar: string = "";
  username: string = this.userService.user()!.username;

  avatarPics = [
    "https://res.cloudinary.com/dzwufjd9o/image/upload/v1750801760/AvatarMaker_zm7dot.webp",
    "https://res.cloudinary.com/dzwufjd9o/image/upload/v1750801760/AvatarMaker_2_qq98tm.webp",
    "https://res.cloudinary.com/dzwufjd9o/image/upload/v1750801759/AvatarMaker_3_uiaar5.webp",
    "https://res.cloudinary.com/dzwufjd9o/image/upload/v1750801759/AvatarMaker_1_pyzmwc.webp",
    "https://res.cloudinary.com/dzwufjd9o/image/upload/v1750801760/AvatarMaker_5_lv45g1.webp",
    "https://res.cloudinary.com/dzwufjd9o/image/upload/v1750801759/AvatarMaker_4_xkqpbg.webp"
  ];

  changeAvatar(img: HTMLImageElement){
    const avatars = document.querySelectorAll(".avatares__pic");
    for(let image of avatars){
      image.classList.remove("avatares__pic--selected");
      if(image.id == img.id){
        image.classList.add("avatares__pic--selected");
        this.selectedAvatar = img.src;
      }
    }
  }

  updateAvatar(){
    if(this.selectedAvatar != ""){
      this.showLoader = true;
      this.closePicOptions();
      this.userService.updateAvatar(this.selectedAvatar).subscribe({
        next: data =>{
          this.userService.user()!.profilePic = data.profilePic;
          this.showLoader = false;
        },
        error: err =>{
          console.log(err.error);
          this.showLoader = false;
        }
      });
    }
  }

  updateProfilePic(event: Event){
    this.closePicOptions();
    const formData = new FormData();
    const input = event.target as HTMLInputElement;

    if(input){
      const file = input.files;
      if(file){
        formData.append("profilePic", file[0]);
        this.closePicOptions();
        this.showLoader = true;
        this.userService.updateProfilePic(formData).subscribe({
          next: data =>{
            this.showLoader = false;
            this.userService.user()!.profilePic = data.profilePic;
          },
          error: err =>{
            console.log(err, err.error);
            this.showLoader = false;
          }
        });
      }
    }
  }

  updateUser(){    
    this.username = this.username.trim();

    if(this.username == this.userService.user()!.username){
      return;
    }

    if(this.username == ""){
        this.showErrorMsg("No se puede dejar vacío el campo");
        return;
    }

    const isUsernameValid = this.usernameRegex.test(this.username);

    if(!isUsernameValid){
        this.showErrorMsg("Formato incorrecto");
        return;
    }
    this.showLoader = true;
    this.userService.updateUser(this.username).subscribe({
      next: data =>{
        this.showLoader = false;
        this.userService.user()!.username = data.user.username;
      },
      error: err =>{
        console.log(err, err.error);
        this.showErrorMsg(err.error);
        this.showLoader = false;
      }
    });
  }

  closePicOptions(){
    this.showAvatars = false;
    this.showPicOptions = false;
  }

  showErrorMsg(msg: string){
    this.showError = true;
    this.errorMsg = msg;
    setTimeout(()=>{
      this.showError = false;
      this.errorMsg = "";
    }, 2000);
  }

  back(){
    this.goBack.emit();
  }
}
