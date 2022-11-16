import { Store } from "@lauf/store";
import { Story } from "../engine/types";
import { ReaderState } from "./types";
import { GNexted, unhandled } from "../util";

export async function read(story: Story, store: Store<ReaderState>) {
  const sequence = story();

  let nextValue: GNexted<typeof sequence> = undefined;

  for (;;) {
    // get the next action
    const { done, value } = sequence.next(nextValue);
    if (done) {
      return value;
    }

    // render title without waiting
    if (value.kind === "title") {
      store.write({
        ...store.read(),
        title: value.passage,
      });
      continue;
    }

    // render tell page, wait for turnPage callback
    if (value.kind === "tell") {
      await new Promise<void>((resolve) => {
        store.write({
          ...store.read(),
          page: {
            ...value,
            turnPage: () => resolve(),
          },
        });
      });
      continue;
    }

    // render prompt page, wait for selectChoice callback
    if (value.kind === "prompt") {
      nextValue = await new Promise<string>((resolve) => {
        store.write({
          ...store.read(),
          page: {
            ...value,
            selectChoice: (choice) => resolve(choice),
          },
        });
      });
      continue;
    }

    // above cases should be exhaustive - this should never be reached
    unhandled(value);
  }
}
