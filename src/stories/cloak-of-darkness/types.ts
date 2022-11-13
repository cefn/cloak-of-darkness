import { END } from "../../lib/story/write";
import { createWorld, initWorldState } from "./story";

export type WorldState = ReturnType<typeof initWorldState>;
export type World = ReturnType<typeof createWorld>;
export type RoomId = keyof World;
export type Room = World[RoomId];
export type Destination = RoomId | typeof END;
