import { DelegatingGenerator, GYielded } from "../util";
import { tell, prompt } from "./actions";

export type Id = string;

export type Passage = JSX.Element;

export type ActionDelegator =
  | ReturnType<typeof tell>
  | ReturnType<typeof prompt>;

export type Action = GYielded<ActionDelegator>;

/** An ActionSequence is a sequence of calls to title, tell, prompt, which
 * eventually returns a Ret to its yieldee. */
export type ActionSequence<Ret> = DelegatingGenerator<ActionDelegator, Ret>;

export type Story = () => ActionSequence<void>;
