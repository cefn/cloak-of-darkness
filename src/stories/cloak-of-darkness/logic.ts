import { StoryActionGenerator } from "../../lib/story/types";

import { outside, lobby, bar, cloakroom } from "./passages";

function createWorld() {
  return {
    outside,
    lobby,
    bar,
    cloakroom,
  };
}

function initWorldState() {
  return {
    shakenCloak: false,
    hasCloak: true,
  };
}

/** A value that can be returned to indicate the end of the story */
export const END = Symbol();

export default function* story(): StoryActionGenerator {
  // initialise the story
  const world = createWorld();
  const worldState = initWorldState();

  // begin in the lobby
  let destination: Destination = "lobby";

  // keep visiting rooms until you reach the end
  for (;;) {
    if (destination === END) {
      // if destination is END, story is complete
      return;
    }
    // retrieve the destination room
    const room: Room = world[destination];
    // complete room sequence to get next destination
    destination = yield* room(worldState);
  }
}

/** Types referenced by passages */
export type Destination = RoomId | typeof END;
export type WorldState = ReturnType<typeof initWorldState>;

/** Local types derived from implementations below */
type World = ReturnType<typeof createWorld>;
type RoomId = keyof World;
type Room = World[RoomId];
