import { StoryActionGenerator } from "../../lib/story/types";
import { END } from "../../lib/story/write";
import type { Destination, Room } from "../cloak-of-darkness/types";
import { outside, lobby, bar, cloakroom } from "../cloak-of-darkness/passages";

export function createWorld() {
  return {
    outside,
    lobby,
    bar,
    cloakroom,
  };
}

export function initWorldState() {
  return {
    shakenCloak: false,
    hasCloak: true,
  };
}

export function* story(): StoryActionGenerator {
  // initialise
  const world = createWorld();
  const worldState = initWorldState();

  // begin in the lobby
  let destination: Destination = "outside";

  // keep visiting destinations until you reach the end
  for (;;) {
    // check if story is complete
    if (destination === END) {
      return;
    }

    // otherwise retrieve the room from the destination (RoomId)
    const room: Room = world[destination];

    // complete room sequence to get next destination
    destination = yield* room(worldState);
  }
}
