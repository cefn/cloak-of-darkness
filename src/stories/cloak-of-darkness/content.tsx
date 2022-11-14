import { END, prompt, tell } from "../../lib/story/write";
import type { StoryGenerator } from "../../lib/story/types";

type World = ReturnType<typeof createWorld>;
type WorldState = ReturnType<typeof initWorldState>;

/** Types shared with story logic (navigating between rooms) */
export type Destination = keyof World | typeof END;
export type Room = (state: WorldState) => StoryGenerator<Destination>;

export function createWorld() {
  return {
    outside,
    lobby,
    cloakroom,
    bar,
  };
}

export function initWorldState() {
  return {
    turnsInBar: 0,
    shakenCloak: false,
    hasCloak: true,
  };
}

export const outside: Room = function* () {
  yield* tell(
    <>
      Hurrying through the rainswept November night, you're glad to see the
      bright lights of the Foyer. It's surprising that there aren't more people
      about but, hey, what do you expect in a cheap demo game...?
    </>
  );
  return "lobby";
};

export const lobby: Room = function* (state) {
  if (!state.shakenCloak) {
    state.shakenCloak = true;
    yield* tell(
      <>Shaking the rain from your Cloak, you step gratefully inside.</>
    );
  }

  const defaultChoices = {
    preventedNorth: <>Go North</>,
    bar: <>Go South</>,
    cloakroom: <>Go West</>,
  };

  const choices = !state.hasCloak
    ? defaultChoices
    : {
        ...defaultChoices,
        inspectCloak: <>Inspect your cloak</>,
      };

  const choice = yield* prompt(
    <>
      You are standing in a spacious hall, splendidly decorated in red and gold,
      with glittering chandeliers overhead. The entrance from the street is to
      the north, and there are doorways south and west.
    </>,
    choices
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
        You can't go north. The door has locked behind you and there is no
        visible mechanism to open it.
      </>
    );
    return "lobby";
  }
  return choice;
};

export const cloakroom: Room = function* (state) {
  const commonChoices = {
    east: <>Leave through the East door</>,
    lookAtHook: <>Look at the hook</>,
  };

  const choices = state.hasCloak
    ? {
        ...commonChoices,
        hangCloak: <>Hang up your Cloak</>,
      }
    : {
        ...commonChoices,
        wearCloak: <>Put on your Cloak</>,
      };

  const choice = yield* prompt(
    <>
      The walls of this small room were clearly once lined with hooks, though
      now only one remains.
      {state.hasCloak ? (
        <>You could hang your cloak your cloak here.</>
      ) : (
        <>
          It holds your cloak. You could pick up your cloak and wear it, if you
          like
        </>
      )}
    </>,
    choices
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
        {state.hasCloak ? (
          <>You could hang up your cloak here.</>
        ) : (
          <>Your coat is hanging there.</>
        )}
      </>
    );
  }
  return "cloakroom";
};

export const bar: Room = function* (state) {
  if (state.hasCloak) {
    return yield* darkBar(state);
  } else {
    return yield* lightBar(state);
  }
};

export const darkBar: Room = function* (state) {
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

export const lightBar: Room = function* (state) {
  yield* tell(
    <>
      The bar, much rougher than you'd have guessed after the opulence of the
      foyer to the north, is completely empty. You're glad you hung up your
      cloak. It's darkness would have sucked all the dim light from this room.
      Through the dim light you make out some sort of message scrawled in the
      sawdust on the floor.
    </>
  );
  if (state.turnsInBar <= 3) {
    yield* tell(
      <>
        The message, neatly marked in the sawdust, reads...
        <h1>You have won</h1>
      </>
    );
  } else {
    yield* tell(
      <>
        On the floor is a pile of sawdust scuffed by many footprints. You can
        make out a few letters...
        <h1>You h*v* w*n</h1>
        ...but the rest of the message has been lost. You can never know the
        secret of the Opera House now!
      </>
    );
  }
  return END;
};
