import { Store } from "@lauf/store";
import { ActionSequence } from "../engine/types";
import { ReaderState } from "./types";
import { GNexted, unhandled } from "../util";

export async function readStory(
  sequence: ActionSequence<void>,
  store: Store<ReaderState>
) {
  let nextValue: GNexted<typeof sequence> = undefined;

  for (;;) {
    // get the next action
    const { done, value } = sequence.next(nextValue);
    if (done) {
      return value;
    }

    if (value.kind === "title") {
      // render title
      store.write({
        ...store.read(),
        title: value.passage,
      });
    } else if (value.kind === "tell") {
      // render tell page, await turnPage callback
      await new Promise<void>((resolve) => {
        store.write({
          ...store.read(),
          page: {
            ...value,
            turnPage: () => resolve(),
          },
        });
      });
    } else if (value.kind === "prompt") {
      // render prompt page, await selectChoice callback
      nextValue = await new Promise<string>((resolve) => {
        store.write({
          ...store.read(),
          page: {
            ...value,
            selectChoice: (choice) => resolve(choice),
          },
        });
      });
    } else {
      // above cases should be exhaustive - this should never be reached
      unhandled(value);
    }
  }
}
