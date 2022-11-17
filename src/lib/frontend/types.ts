import { Id, Passage, PromptAction, TellAction } from "../engine/types";

/** Compose a state combining the last action from the story with a callback
 * which progresses to the next page or choice . */

interface EmptyState {
  kind: "empty";
}

export type TellState = TellAction & {
  turnPage: () => void;
};

export type PromptState<ChoiceId extends Id> = PromptAction<ChoiceId> & {
  selectChoice: (choice: ChoiceId) => void;
};

type PageState = TellState | PromptState<Id> | EmptyState;

export interface ReaderState {
  title: Passage;
  page: PageState;
}
