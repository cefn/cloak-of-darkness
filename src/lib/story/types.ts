import { DelegatingGenerator, GeneratorUnion } from "../util";

export type Id = string;

export type Passage = JSX.Element;

export interface TellOptions {
  passage: Passage;
}

export interface PromptOptions<ChoiceId extends Id> {
  passage: Passage;
  choices: {
    [id in ChoiceId]: Passage;
  };
}

export type TellFn = (options: TellOptions) => Promise<void>;

export type PromptFn = <ChoiceId extends Id>(
  options: PromptOptions<ChoiceId>
) => Promise<ChoiceId>;

export type TellActionGenerator = Generator<
  TellOptions & { action: "tell" },
  void,
  any
>;

export type PromptActionGenerator<ChoiceId extends Id> = Generator<
  PromptOptions<ChoiceId> & { action: "prompt" },
  ChoiceId,
  any
>;

export type StoryActionGenerator<Ret = void> = DelegatingGenerator<
  GeneratorUnion<TellActionGenerator | PromptActionGenerator<Id>>,
  Ret
>;

export type Story = () => StoryActionGenerator<void>;
