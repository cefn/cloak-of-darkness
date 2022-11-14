/** Infers the yielded value from a generator type */
export type GYielded<G extends Generator> = G extends Generator<infer yielded>
  ? yielded
  : never;

/** Infers the next() argument from a generator type */
export type GReturned<G extends Generator> = G extends Generator<
  any,
  infer returned
>
  ? returned
  : never;

/** Infers the returned value from a generator type */
export type GNexted<G extends Generator> = G extends Generator<
  any,
  any,
  infer nexted
>
  ? nexted
  : never;

/** Utility type for variables which may store more than one type of generator.
 * Helps to define a generator consumer that must handle all kinds of yielded,
 * nexted, returned values from those different types.
 */
export type GeneratorUnion<G extends Generator> = Generator<
  G extends Generator ? GYielded<G> : never,
  G extends Generator ? GReturned<G> : never,
  G extends Generator ? GNexted<G> : never
>;

/** Utility for typing a generator that wraps other Delegated generators. It
 * will yield* to them and consume their return values, but it has its own
 * return type.
 */
export type DelegatingGenerator<Delegated extends Generator, Ret> = Generator<
  Delegated extends Generator ? GYielded<Delegated> : never,
  Ret,
  Delegated extends Generator ? GNexted<Delegated> : never
>;
