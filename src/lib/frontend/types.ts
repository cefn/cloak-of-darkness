import { PromptAction, TellAction } from "../engine/actions";
import { Id, Passage } from "../engine/types";

/** Compose a state combining the last action from the story with a callback
 * which progresses to the next page or choice . */

interface EmptyState {
  kind: "empty";
}

type TellState = TellAction & {
  turnPage: () => void;
};

type PromptState<ChoiceId extends Id> = PromptAction<ChoiceId> & {
  selectChoice: (choice: ChoiceId) => void;
};

type PageState = TellState | PromptState<Id> | EmptyState;

export type PageKind = PageState["kind"];

export interface ReaderState {
  title: Passage;
  page: PageState;
}
