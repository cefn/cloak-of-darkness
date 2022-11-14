import type { Story } from "../../lib/story/types";
import { END } from "../../lib/story/write";
import { createWorld, initWorldState, Destination, Room } from "./content";

// TODO consider how to make this a generic function (that composes a Destination and Room type from the state functions )
export const story: Story = function* () {
  // initialise
  const world = createWorld();
  const worldState = initWorldState();

  // begin outside the lobby
  let destination: Destination = "outside";

  // keep visiting destinations until you reach the end
  for (;;) {
    // check if story is complete
    if (destination === END) {
      return;
    }

    // otherwise retrieve the room from the destination (RoomId)
    const room: Room = world[destination];

    // complete room sequence to be given next destination
    destination = yield* room(worldState);
  }
};
