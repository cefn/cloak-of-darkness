import { DelegatingGenerator } from "../util";
import { tell, title, prompt } from "./actions";

export type Id = string;

export type Passage = JSX.Element;

export interface TitleAction {
  kind: "title";
  passage: Passage;
}

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

/** An ActionSequence is a sequence of calls to title, tell, prompt, which
 * finally results in some value that serves the logic of its calling generator. */
export type ActionSequence<Ret> = DelegatingGenerator<
  | ReturnType<typeof title>
  | ReturnType<typeof tell>
  | ReturnType<typeof prompt>,
  Ret
>;

export type Story = () => ActionSequence<void>;
