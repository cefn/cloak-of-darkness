export function decorateSequence<
  G extends Generator<Yielded>,
  Yielded,
  Decorated
>(
  generator: G,
  decorate: (yielded: Yielded) => Decorated
): Generator<Decorated, GReturned<G>, GNexted<G>> {
  function mapResult(result: IteratorResult<Yielded, GReturned<G>>) {
    const { value, done } = result;
    if (!done) {
      return {
        done,
        value: decorate(value),
      };
    }
    return result;
  }

  return {
    [Symbol.iterator]() {
      return this;
    },
    next(...args) {
      return mapResult(generator.next(...args));
    },
    return(value) {
      return mapResult(generator.return(value));
    },
    throw(e) {
      return mapResult(generator.throw(e));
    },
  };
}

export function createSatisfies<Base>() {
  return <Actual extends Base>(value: Actual) => value;
}

export function unhandled(item: never) {
  throw new Error(`Cases not exhaustive at runtime - received ${item}`);
}

export function safeEntries<K extends string, T extends { [k in K]: any }>(
  item: T
) {
  return Object.entries(item) as [K, T[K]][];
}

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

/** Utility for typing a generator that wraps other Delegated generators. It
 * will yield* to them and consume their return values, but it has its own
 * return type.
 */
export type DelegatingGenerator<Delegated extends Generator, Ret> = Generator<
  Delegated extends Generator ? GYielded<Delegated> : never,
  Ret,
  any
>;
