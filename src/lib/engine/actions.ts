import { Passage, PromptAction, TellAction, TitleAction } from "./types";

export function* title(passage: Passage): Generator<TitleAction, void, void> {
  yield {
    kind: "title",
    passage,
  };
}

export function* tell(passage: Passage): Generator<TellAction, void, void> {
  yield {
    kind: "tell",
    passage,
  };
}

export function* prompt<ChoiceId extends string>(
  passage: Passage,
  choices: {
    [id in ChoiceId]?: Passage;
  }
): Generator<PromptAction<ChoiceId>, ChoiceId, ChoiceId> {
  const choice = yield {
    kind: "prompt",
    passage,
    choices,
  };
  return choice;
}
