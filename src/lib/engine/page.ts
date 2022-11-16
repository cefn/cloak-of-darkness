import { createStore, Store } from "@lauf/store";
import { createContext } from "react";
import { Passage } from "./types";

interface StartState {
  kind: "start";
  passage: Passage;
  begin: () => PageState;
}

interface TellState {
  kind: "tell";
  passage: Passage;
  turnPage: () => PageState;
}

interface PromptState<ChoiceId extends string> {
  kind: "prompt";
  passage: Passage;
  choices: {
    [choice in ChoiceId]: Passage;
  };
  makeChoice: (choice: ChoiceId) => PageState;
}

interface EndState {
  kind: "end";
  passage: Passage;
  begin: () => PageState;
}

type PageState = StartState | TellState | PromptState<any>;

const PageStoreContext = createContext<Store<PageState>>(
  createStore({
    kind: "start",
  })
);
