import {
  Passage,
  PromptActionGenerator,
  TellActionGenerator,
  TitleActionGenerator,
} from "./types";

/** A value that can be returned to indicate the end of the story */
export const END = Symbol();

export function* title(passage: Passage): TitleActionGenerator {
  yield {
    action: "title",
    passage,
  };
}

export function* tell(passage: Passage): TellActionGenerator {
  yield {
    action: "tell",
    passage,
  };
}

export function* prompt<ChoiceId extends string>(
  passage: Passage,
  choices: {
    [id in ChoiceId]?: Passage;
  }
): PromptActionGenerator<ChoiceId> {
  const choice = yield {
    action: "prompt",
    passage,
    choices,
  };
  return choice;
}
