import { Id, Passage, PromptAction, TellAction } from "../engine/types";

/** Stores last action structure as current app state, plus a function which progresses to the next state. */

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
