import { END } from "../../lib/engine/actions";
import { ActionSequence } from "../../lib/engine/types";
import { createWorld, initWorldState } from "./content";

type World = ReturnType<typeof createWorld>;
type WorldState = ReturnType<typeof initWorldState>;

/** Types shared with story logic (navigating between rooms) */
export type Destination = keyof World | typeof END;
export type Room = (state: WorldState) => ActionSequence<Destination>;
