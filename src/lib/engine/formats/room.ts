import { END, title } from "../actions";
import { ActionSequence, Id, Passage } from "../types";

/** Rooms are ActionSequences named by ids, whose sequences result in the next
 * id room id. This structure defines rooms that reference each other. */
export type Rooms<RoomId extends Id, State> = {
  [id in RoomId]: (state: State) => ActionSequence<RoomId | typeof END>;
};

/** Minimal world state with a current room and titles for each room. Real stories will extend this */
export type RoomState<RoomId extends Id> = {
  roomId: RoomId;
  roomTitles: { [id in RoomId | typeof END]: Passage };
};

/** ActionSequence delegating story sequences to rooms */
export function* roomStory<
  RoomId extends Id,
  WorldState extends RoomState<RoomId>
>(options: {
  createRooms: () => Rooms<RoomId, WorldState>;
  createWorldState: () => WorldState;
}): ActionSequence<void> {
  const { createRooms, createWorldState } = options;

  // initialise
  const rooms = createRooms();
  const worldState = createWorldState();

  // keep visiting destinations until you reach the end
  for (;;) {
    const titlePassage = worldState.roomTitles[worldState.roomId];
    // set title according to room
    yield* title(titlePassage);

    // retrieve the next room
    const room = rooms[worldState.roomId];

    // complete room tell/prompt sequence to get next room
    const roomIdOrEnd = yield* room(worldState);

    // check if story is complete
    if (roomIdOrEnd === END) {
      return;
    } else {
      worldState.roomId = roomIdOrEnd;
    }
  }
}
