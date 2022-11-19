import type { ActionSequence, Story } from "../lib/engine/types";
import type { RoomWorldState } from "../lib/engine/extensions/room";
import { roomStory, END } from "../lib/engine/extensions/room";
import { tell } from "../lib/engine/actions";

/** Locations in the story. */
type RoomId = "library";

/** Player state consumed and manipulated within each room */
interface WorldState extends RoomWorldState<RoomId> {}

/** An ActionSequence yields tell and prompt pages, returns a destination RoomId
 * (or END)*/
type Room = (state: WorldState) => ActionSequence<RoomId | typeof END>;

const library: Room = function* (state) {
  yield* tell(<>You are in a room</>);
  return END;
};

/** Delegates to roomStory() which yields title/tell/prompt actions, combining
 * the rooms into a navigable world having shared global state. */
export const story: Story = function* () {
  const rooms = {
    library,
  };

  const worldState: WorldState = {
    currentRoomId: "library",
    roomTitles: {
      library: <>Professor Plum's Library</>,
    },
  };

  yield* roomStory({
    rooms,
    worldState,
  });
};
