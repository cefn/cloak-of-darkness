import { Action, ActionSequence, Id, Passage } from "../types";

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
export type RoomLookup<
  RoomId extends string,
  WorldState extends RoomWorldState<RoomId>
> = {
  [id in RoomId]: (state: WorldState) => ActionSequence<RoomId | typeof END>;
};

/** Combines state definition and room lookup, enough to execute a roomStory */
type RoomStoryOptions<
  RoomId extends string,
  WorldState extends RoomWorldState<RoomId>
> = {
  worldState: WorldState;
  rooms: RoomLookup<RoomId, WorldState>;
};

/** Modifies the passage in a tell or prompt, adding a header. */
export function addRoomHeader<RoomId extends string>(
  action: Action,
  roomWorldState: RoomWorldState<RoomId>
): Action {
  const { roomTitles, currentRoomId } = roomWorldState;
  const title = roomTitles[currentRoomId];
  return {
    ...action,
    passage: (
      <>
        <h3>{title}</h3>
        {action.passage}
      </>
    ),
  };
}

/** ActionSequence delegating story sequences to rooms */
export function* roomStory<
  RoomId extends Id,
  WorldState extends RoomWorldState<RoomId>
>(options: RoomStoryOptions<RoomId, WorldState>): ActionSequence<void> {
  const { rooms, worldState } = options;

  let room = rooms[worldState.currentRoomId];

  for (;;) {
    // room sequence returns destination or END
    const roomIdOrEnd = yield* room(worldState);

    // check if story is complete
    if (roomIdOrEnd === END) {
      return;
    }

    // else prepare for next room sequence
    room = rooms[roomIdOrEnd];
    worldState.currentRoomId = roomIdOrEnd;
  }
}
