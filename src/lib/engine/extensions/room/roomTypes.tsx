import { ActionSequence, Passage } from "../../types";
import { END } from "./roomStory";

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

/** An options object with both WorldState definition and RoomId lookup - enough
 * to execute a roomStory */
export type RoomStoryOptions<
  RoomId extends string,
  WorldState extends RoomWorldState<RoomId>
> = {
  worldState: WorldState;
  rooms: RoomLookup<RoomId, WorldState>;
};
