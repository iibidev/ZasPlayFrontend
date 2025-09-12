import { Game } from "./game.model";
import { Player } from "./player.model";

export interface Room{
    game: Game,
    players: Player[],
    code: string,
    status: string
}