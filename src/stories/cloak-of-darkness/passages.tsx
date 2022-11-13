import { prompt, tell } from "../../lib/story/write";
import type { Passage, StoryActionGenerator } from "../../lib/story/types";
import { Destination, END, WorldState } from "./logic";

const cloakPassage = (
  <>
    A handsome cloak, of velvet trimmed with satin, and slightly spattered with
    raindrops. Its blackness is so deep that it almost seems to suck light from
    the room.
  </>
);

export function* outside(state: WorldState): StoryActionGenerator<Destination> {
  yield* tell(
    <>
      Hurrying through the rainswept November night, you're glad to see the
      bright lights of the Foyer. It's surprising that there aren't more people
      about but, hey, what do you expect in a cheap demo game...?
    </>
  );
  return "lobby";
}

export function* lobby(state: WorldState): StoryActionGenerator<Destination> {
  if (!state.shakenCloak) {
    state.shakenCloak = true;
    yield* tell(
      <>Shaking the rain from your Cloak, you step gratefully inside.</>
    );
  }

  const choice = yield* prompt(
    <>
      You are standing in a spacious hall, splendidly decorated in red and gold,
      with glittering chandeliers overhead. The entrance from the street is to
      the north, and there are doorways south and west.
    </>,
    {
      outside: <>Go North</>,
      bar: <>Go South</>,
      cloakroom: <>Go West</>,
      inspectCloak: <>Inspect your cloak</>,
    }
  );

  if (choice === "inspectCloak") {
    yield* tell(cloakPassage);
    return "lobby";
  }
  return choice;
}

export function* bar(state: WorldState): StoryActionGenerator<Destination> {
  if (!state.hasCloak) {
    return yield* lightBar(state);
  } else {
    return yield* darkBar(state);
  }
}

function* lightBar(state: WorldState): StoryActionGenerator<Destination> {
  yield* tell(
    <>
      The bar, much rougher than you'd have guessed after the opulence of the
      foyer to the north, is completely empty. There seems to be some sort of
      message scrawled in the sawdust on the floor.
    </>
  );
  yield* tell(
    <>
      The message, neatly marked in the sawdust, reads...
      <h1>You have won</h1>
    </>
  );
  return END;
}

function* darkBar(state: WorldState): StoryActionGenerator<Destination> {
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
  const thirdChoice = yield* prompt(
    <>
      No, this isn't getting you anywhere... Let's see, the door was south,
      wasn't it? So the exit must be north, unless you've gotten turned around.
    </>,
    {
      sure: <>I'm sure which way is North</>,
      unsure: <>Maybe I've got turned around</>,
    }
  );
  if (thirdChoice === "sure") {
    return "lobby";
  }
  yield* tell(
    <>Oops, this is just a blank wall! But perhaps if you follow it around...</>
  );
  return "lobby";
}

export function* cloakroom(
  state: WorldState
): StoryActionGenerator<Destination> {
  const passage = (
    <>
      The walls of this small room were clearly once lined with hooks, though
      now only one remains.
      {state.hasCloak ? (
        <>You could hang your cloak your cloak here.</>
      ) : (
        <>You could pick up your cloak and wear it, if you like</>
      )}
    </>
  );

  const defaultChoices = {
    east: <>Leave through the East door</>,
  } as const;

  let choice;
  if (!state.hasCloak) {
    choice = yield* prompt(passage, defaultChoices);
  } else {
    choice = yield* prompt(passage, {
      ...defaultChoices,
      hangCloak: <>Hang up your Cloak</>,
    });
  }

  if (choice === "hangCloak") {
    state.hasCloak = false;
    return "cloakroom";
  }
  return "lobby";
}
