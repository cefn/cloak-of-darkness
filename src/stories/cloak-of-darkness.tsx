import { ActionSequence } from "../lib/engine/types";
import { END, prompt, tell } from "../lib/engine/actions";
import { RoomsState } from "../lib/engine/formats/room";

export function createWorldState(): CodWorldState {
  return {
    turnsInBar: 0,
    hasCloak: true,
    currentRoomId: "outside",
    roomTitles: {
      outside: <>Outside the Opera House</>,
      lobby: <>Lobby</>,
      cloakroom: <>Cloakroom</>,
      bar: <>Bar</>,
      [END]: <>You have finished the game</>,
    },
  };
}

export function createRooms() {
  return {
    outside,
    lobby,
    cloakroom,
    bar,
  };
}

export const outside: CodRoom = function* (state) {
  yield* tell(
    <>
      Hurrying through the rainswept November night, you're glad to see the
      bright lights of the Foyer. It's surprising that there aren't more people
      about but, hey, what do you expect in a cheap demo game...?
    </>
  );
  yield* tell(
    <>Shaking the rain from your Cloak, you step gratefully inside.</>
  );
  return "lobby";
};

export const lobby: CodRoom = function* (state) {
  const choice = yield* prompt(
    <>
      You are standing in a spacious hall, splendidly decorated in red and gold,
      with glittering chandeliers overhead. The entrance from the street is to
      the north, and there are doorways south and west.
    </>,
    {
      preventedNorth: <>Go North</>,
      bar: <>Go South</>,
      cloakroom: <>Go West</>,
      ...(state.hasCloak && { inspectCloak: <>Inspect your cloak</> }),
    }
  );

  if (choice === "inspectCloak") {
    yield* tell(
      <>
        A handsome cloak, of velvet trimmed with satin, and slightly spattered
        with raindrops. Its blackness is so deep that it almost seems to suck
        light from the room.
      </>
    );
    return "lobby";
  }
  if (choice === "preventedNorth") {
    yield* tell(
      <>
        You've only just arrived, and besides, the weather outside seems to be
        getting worse.
      </>
    );
    return "lobby";
  }
  return choice;
};

export const cloakroom: CodRoom = function* (state) {
  const choice = yield* prompt(
    <>
      The walls of this small room were clearly once lined with hooks, though
      now only one remains.
      {!state.hasCloak && <> It holds your cloak.</>}
    </>,
    {
      east: <>Leave through the East door</>,
      lookAtHook: <>Look at the hook</>,
      ...(state.hasCloak
        ? {
            hangCloak: <>Hang up your Cloak</>,
          }
        : {
            wearCloak: <>Put on your Cloak</>,
          }),
    }
  );

  if (choice === "east") {
    return "lobby";
  }

  if (choice === "hangCloak") {
    yield* tell(<>You hang up your cloak.</>);
    state.hasCloak = false;
  }
  if (choice === "wearCloak") {
    yield* tell(<>You put on your cloak</>);
    state.hasCloak = true;
  }
  if (choice === "lookAtHook") {
    yield* tell(
      <>
        It's just a small brass hook, screwed to the wall.
        {!state.hasCloak && <> Your coat is hanging there.</>}
      </>
    );
  }
  return "cloakroom";
};

export const bar: CodRoom = function* (state) {
  if (state.hasCloak) {
    return yield* darkBar(state);
  } else {
    return yield* lightBar(state);
  }
};

export const darkBar: CodRoom = function* (state) {
  state.turnsInBar += 1;

  const firstChoice = yield* prompt(
    <>
      You can't see a thing! Not even the door you entered by--was it north,
      south, east or west?
    </>,
    {
      north: <>Grope north</>,
      south: <>Grope south</>,
      east: <>Grope east</>,
      west: <>Grope west</>,
    }
  );
  if (firstChoice === "north") {
    return "lobby";
  }

  state.turnsInBar += 1;

  const secondChoice = yield* prompt(
    <>
      Blundering around in the dark isn't a good idea! You can't tell left from
      right, let alone east from west or north from south.
    </>,
    {
      north: <>Stumble North</>,
      south: <>Stumble South</>,
      east: <>Stumble East</>,
      west: <>Stumble West</>,
      left: <>Stumble Left</>,
      right: <>Stumble Right</>,
    }
  );
  if (secondChoice === "north") {
    return "lobby";
  }

  state.turnsInBar += 1;

  const thirdChoice = yield* prompt(
    <>
      No, this isn't getting you anywhere... Let's see, the door was south,
      wasn't it? So the exit must be north, unless you've gotten turned around.
    </>,
    {
      confident: <>I'm sure which way is North</>,
      unconfident: <>Maybe I've got turned around</>,
    }
  );
  if (thirdChoice === "confident") {
    return "lobby";
  }

  state.turnsInBar += 1;

  yield* tell(
    <>Oops, this is just a blank wall! But perhaps if you follow it around...</>
  );
  return "lobby";
};

export const lightBar: CodRoom = function* (state) {
  yield* tell(
    <>
      The bar, much rougher than you'd have guessed after the opulence of the
      foyer to the north, is completely empty. You're glad you hung up your
      cloak. Its darkness would have sucked all the dim light from this room.
      Through the dim light you make out some sort of message scrawled in the
      sawdust on the floor.
    </>
  );
  if (state.turnsInBar <= 3) {
    yield* tell(
      <>
        The message, neatly marked in the sawdust, reads...
        <h1>You have won!</h1>
      </>
    );
  } else {
    yield* tell(
      <>
        On the floor is a pile of sawdust scuffed by many footprints. You can
        make out a few letters...
        <h3>You h*v* w*n</h3>
        ...but the rest of the message has been lost. You can never know the
        secret of the Opera House now.
        <h1>You have lost!</h1>
      </>
    );
  }
  return END;
};

/** Types that help with auto-completion and type-checking above */

/** State consumed and manipulated within Room Logic */
interface CodWorldState extends RoomsState<CodRoomId> {
  turnsInBar: number;
  hasCloak: boolean;
}

/** A Room yields tell and prompt pages, then returns a destination RoomId */
type CodRoom = (state: CodWorldState) => ActionSequence<CodRoomId | typeof END>;

/** Derive RoomId from factory function */
type CodRoomId = keyof ReturnType<typeof createRooms>;
