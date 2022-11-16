import { END, title } from "../../lib/engine/actions";
import { Passage, Story } from "../../lib/engine/types";
import { createWorld, initWorldState } from "./content";
import { Destination, Room } from "./types";

const titles: { [k in Destination]: Passage } = {
  bar: <>Bar</>,
  cloakroom: <>Cloakroom</>,
  lobby: <>Lobby</>,
  outside: <>Outside the Opera House</>,
  [END]: <>You have finished the game</>,
};

// TODO consider how to make this a generic function (that composes a Destination and Room type from the state functions )
export const story: Story = function* () {
  // initialise
  const world = createWorld();
  const worldState = initWorldState();

  // begin outside the lobby
  let destination: Destination = "outside";

  // keep visiting destinations until you reach the end
  for (;;) {
    // populate the title according to the current room
    yield* title(titles[destination]);

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
