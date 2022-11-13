export type GYielded<G extends Generator> = G extends Generator<infer yielded>
  ? yielded
  : never;

export type GReturned<G extends Generator> = G extends Generator<
  any,
  infer returned
>
  ? returned
  : never;

export type GNexted<G extends Generator> = G extends Generator<
  any,
  any,
  infer nexted
>
  ? nexted
  : never;

export type GeneratorUnion<G extends Generator> = Generator<
  G extends Generator ? GYielded<G> : never,
  G extends Generator ? GReturned<G> : never,
  G extends Generator ? GNexted<G> : never
>;

export type DelegatingGenerator<G extends Generator, Ret> = Generator<
  G extends Generator ? GYielded<G> : never,
  Ret,
  G extends Generator ? GNexted<G> : never
>;
