import {
  Id,
  Passage,
  PromptActionGenerator,
  TellActionGenerator,
} from "./types";

export function* tell(passage: Passage): TellActionGenerator {
  yield {
    action: "tell",
    passage,
  };
}

export function* prompt<ChoiceId extends Id>(
  passage: Passage,
  choices: {
    [choice in ChoiceId]: Passage;
  }
): PromptActionGenerator<ChoiceId> {
  const choice = yield {
    action: "prompt",
    passage,
    choices,
  };
  return choice;
}
