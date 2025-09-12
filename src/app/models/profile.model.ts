import { GameStat } from "./gameStat.model";
import { User } from "./user.model";

export interface Profile{
    user: User,
    gameStats: GameStat[],
    me: boolean,
    friend: boolean
}