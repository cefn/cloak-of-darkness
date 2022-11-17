import { title } from "../actions";
import { ActionSequence, Id, Passage } from "../types";

/** A value returned to indicate the end of the story */
export const END = Symbol();

/** Rooms are ActionSequences named by ids, whose sequences result in the next
 * id room id. This structure defines rooms that reference each other. */
export type Rooms<RoomId extends Id, State> = {
  [id in RoomId]: (state: State) => ActionSequence<RoomId | typeof END>;
};

/** Minimal world state with a current room and titles for each room. Real stories will extend this */
export type RoomsState<RoomId extends Id> = {
  currentRoomId: RoomId;
  roomTitles: { [id in RoomId]: Passage };
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
