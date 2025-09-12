import { Room } from "./room.model";
import { User } from "./user.model";

export interface Invitation{
    sender: User,
    room: Room
}