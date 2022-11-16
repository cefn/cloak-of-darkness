import { PromptFn, StoryGenerator, TellFn, TitleFn } from "./types";

interface RunOptions {
  title: TitleFn;
  tell: TellFn;
  prompt: PromptFn;
  story: () => StoryGenerator<void>;
}

export async function read(options: RunOptions) {
  const { story, tell, title, prompt } = options;

  const pages = story();

  /** Prompt passes a value back to its yield. All others pass back undefined*/
  let nextValue: Awaited<ReturnType<typeof prompt>> | void = undefined;

  // visit pages one by one, handing events off to
  // the async user interface and waiting
  for (;;) {
    const { value, done } = pages.next(nextValue);
    if (done) {
      await tell({
        passage: <h1>The End</h1>,
      });
      return value;
    }
    const { action } = value;
    if (action === "title") {
      nextValue = await title(value);
    }
    if (action === "tell") {
      nextValue = await tell(value);
    }
    if (action === "prompt") {
      nextValue = await prompt(value);
    }
  }
}
