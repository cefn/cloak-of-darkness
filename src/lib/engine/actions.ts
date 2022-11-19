import { Id, Passage } from "./types";

export interface TellAction {
  kind: "tell";
  passage: Passage;
}

export interface PromptAction<ChoiceId extends Id> {
  kind: "prompt";
  passage: Passage;
  choices: {
    [id in ChoiceId]?: Passage;
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
