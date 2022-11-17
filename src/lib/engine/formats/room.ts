import { END, title } from "../actions";
import { ActionSequence, Id, Passage } from "../types";

/** Rooms are ActionSequences named by ids, whose sequences result in the next
 * id room id */
export type World<RoomId extends Id, State> = {
  [id in RoomId]: (state: State) => ActionSequence<RoomId | typeof END>;
};

/** Minimal world state that has a current room and room titles. Real stories will extend this */
export type WorldState<RoomId extends Id> = {
  roomId: RoomId;
  roomTitles: { [id in RoomId | typeof END]: Passage };
};

/** ActionSequence delegating story sequences to rooms */
export function* roomStory<
  RoomId extends Id,
  State extends WorldState<RoomId>
>(options: {
  createWorld: () => World<RoomId, State>;
  createWorldState: () => State;
}): ActionSequence<void> {
  const { createWorld, createWorldState } = options;
  // initialise
  const world = createWorld();
  const worldState = createWorldState();

  type Room = typeof world[RoomId];

  // keep visiting destinations until you reach the end
  for (;;) {
    // populate the title according to the current room
    yield* title(worldState.roomTitles[worldState.roomId]);

    // otherwise retrieve the room from the destination (RoomId)
    const room: Room = world[worldState.roomId];

    // complete room sequence to be given next destination
    const destination = yield* room(worldState);

    // check if story is complete
    if (destination === END) {
      return;
    } else {
      worldState.roomId = destination;
    }
  }
}
