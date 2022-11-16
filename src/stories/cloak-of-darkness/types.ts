import { StoryGenerator } from "../../lib/engine/types";
import { END } from "../../lib/engine/write";
import { createWorld, initWorldState } from "./content";

type World = ReturnType<typeof createWorld>;
type WorldState = ReturnType<typeof initWorldState>;

/** Types shared with story logic (navigating between rooms) */
export type Destination = keyof World | typeof END;
export type Room = (state: WorldState) => StoryGenerator<Destination>;
