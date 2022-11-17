import { title } from "../actions";
import { ActionSequence, Id, Passage } from "../types";

/** Types and utilities to create an ActionSequence structured around multiple
 * rooms in a world with global state.
 */

/** A value returned to indicate the end of the story */
export const END = Symbol();

/** World state having at least a current room and titles for each room. Stories
 * will extend this */
export type RoomWorldState<RoomId extends string> = {
  currentRoomId: RoomId;
  roomTitles: { [id in RoomId]: Passage };
};

/** Rooms are ActionSequences named by ids, whose sequences result in the next
 * RoomId. This structure defines a lookup for room ActionSequences that
 * terminate with either a destination RoomId or END. */
type RoomStoryOptions<
  RoomId extends string,
  WorldState extends RoomWorldState<RoomId>
> = {
  worldState: WorldState;
  rooms: {
    [id in RoomId]: (state: WorldState) => ActionSequence<RoomId | typeof END>;
  };
};

/** ActionSequence delegating story sequences to rooms */
export function* roomStory<
  RoomId extends Id,
  WorldState extends RoomWorldState<RoomId>
>(options: RoomStoryOptions<RoomId, WorldState>): ActionSequence<void> {
  const { rooms, worldState } = options;

  let destination: RoomId | typeof END = worldState.currentRoomId;

  // keep visiting destinations until you reach the end
  for (;;) {
    // check if story is complete
    if (destination === END) {
      yield* title(<>Game Over</>);
      return;
    }

    worldState.currentRoomId = destination;
    yield* title(worldState.roomTitles[destination]);

    // retrieve the next room
    const room = rooms[worldState.currentRoomId];

    // complete room tell/prompt sequence and get next room
    destination = yield* room(worldState);
  }
}
