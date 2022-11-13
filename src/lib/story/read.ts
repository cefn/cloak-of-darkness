import { GNexted } from "../util";
import { PromptFn, StoryActionGenerator, TellFn } from "./types";

interface RunOptions {
  tell: TellFn;
  prompt: PromptFn;
  story: () => StoryActionGenerator;
}

export async function read(options: RunOptions) {
  const { story, tell, prompt } = options;
  const pages = story();
  let nextValue: GNexted<typeof pages> = undefined;
  // loop over story pages, getting each page's data
  // and handing it off to an async user interaction
  for (;;) {
    const pageResult = pages.next(nextValue);
    const { value, done } = pageResult;
    if (done) {
      return pageResult.value;
    }
    const { action } = value;
    if (action === "tell") {
      nextValue = await tell(value);
    }
    if (action === "prompt") {
      nextValue = await prompt(value);
    }
  }
}
