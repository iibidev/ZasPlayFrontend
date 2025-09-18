import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Error404 } from './error404/error404';
import { GameList } from './games/game-list/game-list';
import { Profile } from './profile/profile';
import { Rooms } from './rooms/rooms';
import { Login } from './login/login';
import { Register } from './register/register';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
    { path: "", component: Home, title: "ZasPlay - Juega, reta, repite" },
    { path: "games", component: GameList, title: "ZasPlay - todos los juegos" },
    { path: "games/:name/rooms", component: Rooms, title: "ZasPlay"},
    { path: "games/:name/rooms/:code", component: Rooms, title: "ZasPlay"},
    { path: "profile/:id", component: Profile, title: "ZasPlay - perfil" },
    { path: "login", component: Login, title: "ZasPlay - iniciar sesión", canActivate: [authGuard] },
    { path: "register", component: Register, title: "ZasPlay - crear cuenta", canActivate: [authGuard] },
    { path: "**", component: Error404, title: "Error 404 - página no encontrada" }
];
