import {
  DelegatingGenerator,
  GeneratorUnion,
  GNexted,
  GYielded,
} from "../util";

export type Id = string;

export type Passage = JSX.Element;

export interface TitleOptions {
  passage: Passage;
}

export interface TellOptions {
  passage: Passage;
}

export interface PromptOptions<ChoiceId extends Id> {
  passage: Passage;
  choices: {
    [id in ChoiceId]?: Passage;
  };
}

export type TitleFn = (options: TitleOptions) => Promise<void>;

export type TellFn = (options: TellOptions) => Promise<void>;

export type PromptFn = <ChoiceId extends Id>(
  options: PromptOptions<ChoiceId>
) => Promise<ChoiceId>;

export type TitleActionGenerator = Generator<
  TitleOptions & { action: "title" },
  void,
  void
>;

export type TellActionGenerator = Generator<
  TellOptions & { action: "tell" },
  void,
  void
>;

export type PromptActionGenerator<ChoiceId extends Id> = Generator<
  PromptOptions<ChoiceId> & { action: "prompt" },
  ChoiceId,
  ChoiceId
>;

export type StoryGenerator<Ret> = DelegatingGenerator<
  TitleActionGenerator | TellActionGenerator | PromptActionGenerator<Id>,
  Ret
>;

export type Story<Ret = void> = () => StoryGenerator<Ret>;