import { prompt } from "../lib/engine/actions";
import { Story } from "../lib/engine/types";
import { story as hello } from "../stories/goodbye-world";
import { story as empty } from "../stories/minimal-room-story";
import { story as cloak } from "../stories/cloak-of-darkness";

export const menu: Story = function* () {
  const stories = {
    hello,
    empty,
    cloak,
  } as const;

  for (;;) {
    const storyId = yield* prompt(
      <>
        <>Choose from the following demo sequences:</>
        <ul>
          <li>
            Cloak of Darkness: A simple worked example of a room-based story
          </li>
          <li>Hello World: A minimal story which uses no extensions</li>
          <li>
            Empty Room World : An empty starter template for room-based worlds
          </li>
        </ul>
      </>,
      {
        cloak: <>Cloak of Darkness</>,
        hello: <>Hello World</>,
        empty: <>Empty Room</>,
      }
    );
    const story = stories[storyId];

    for (;;) {
      yield* story();
      const again = yield* prompt(<>Play again?</>, {
        yes: <>Yes Please :)</>,
        no: <>No Thanks :(</>,
      });
      switch (again) {
        case "yes":
          continue;
      }
      break;
    }
  }
};
