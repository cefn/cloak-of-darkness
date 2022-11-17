import { END, title } from "../actions";
import { ActionSequence, Id, Passage } from "../types";

/** Rooms are ActionSequences named by ids, whose sequences result in the next
 * id room id. This structure defines rooms that reference each other. */
export type Rooms<RoomId extends Id, State> = {
  [id in RoomId]: (state: State) => ActionSequence<RoomId | typeof END>;
};

/** Minimal world state with a current room and titles for each room. Real stories will extend this */
export type RoomsState<RoomId extends Id> = {
  currentRoomId: RoomId;
  roomTitles: { [id in RoomId | typeof END]: Passage };
};

/** ActionSequence delegating story sequences to rooms */
export function* roomStory<
  RoomId extends Id,
  WorldState extends RoomsState<RoomId>
>(options: {
  createRooms: () => Rooms<RoomId, WorldState>;
  createWorldState: () => WorldState;
}): ActionSequence<void> {
  const { createRooms, createWorldState } = options;

  // initialise
  const rooms = createRooms();
  const worldState = createWorldState();

  // utility to align title with new destination
  function* refreshTitle(destination: RoomId | typeof END) {
    const { roomTitles } = worldState;
    const titlePassage = roomTitles[destination];
    return yield* title(titlePassage);
  }

  // set title for initial room
  yield* refreshTitle(worldState.currentRoomId);

  // keep visiting destinations until you reach the end
  for (;;) {
    // retrieve the next room
    const room = rooms[worldState.currentRoomId];

    // complete room tell/prompt sequence and get next room
    const destination = yield* room(worldState);

    // set title according to room
    yield* refreshTitle(destination);

    // check if story is complete
    if (destination === END) {
      return;
    } else {
      worldState.currentRoomId = destination;
    }
  }
}
