import { PromptFn, StoryActionGenerator, TellFn } from "./types";

interface RunOptions {
  tell: TellFn;
  prompt: PromptFn;
  story: () => StoryActionGenerator;
}

export async function read(options: RunOptions) {
  const { story, tell, prompt } = options;

  type TellResult = Awaited<ReturnType<typeof tell>>;
  type PromptResult = Awaited<ReturnType<typeof prompt>>;

  const pages = story();

  let nextValue: TellResult | PromptResult = undefined;

  // visit pages one by one, handing events off to
  // the async user interface and waiting
  for (;;) {
    const { value, done } = pages.next(nextValue);
    if (done) {
      return value;
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
