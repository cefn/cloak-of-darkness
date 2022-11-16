import { DelegatingGenerator, GeneratorUnion } from "../util";

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
  any // TODO revisit this for strictness (although it doesn't surface in API)
>;

export type TellActionGenerator = Generator<
  TellOptions & { action: "tell" },
  void,
  any // TODO revisit this for strictness (although it doesn't surface in API)
>;

export type PromptActionGenerator<ChoiceId extends Id> = Generator<
  PromptOptions<ChoiceId> & { action: "prompt" },
  ChoiceId,
  any // TODO revisit this for strictness (although it doesn't surface in API)
>;

export type StoryGenerator<Ret = void> = DelegatingGenerator<
  GeneratorUnion<
    TitleActionGenerator | TellActionGenerator | PromptActionGenerator<Id>
  >,
  Ret
>;

// if the above is too complicated
// export type StoryGenerator<Ret> = Generator<
//   GYielded<TellActionGenerator | PromptActionGenerator<Id>>,
//   Ret,
//   any
// >

export type Story<Ret = void> = () => StoryGenerator<Ret>;
