import type { Story } from "../lib/engine/types";
import { prompt, tell } from "../lib/engine/actions";

export const story: Story = function* () {
  yield* tell(
    <>
      <h1>Goodbye World</h1>
      <>By Cefn Hoile</>
    </>
  );
  yield* tell(
    <>
      You wake bruised in a darkened, musty room with the freshness of the sound
      of running water
    </>
  );
  const choice = yield* prompt(
    <>
      You've no idea how you arrived here, but you are so groggy and exhausted
      you're not sure if you can even stand up.
    </>,
    {
      run: <>Run away</>,
      sleep: <>Go back to sleep</>,
      spy: <> Peek through the door</>
    }
  );
  if (choice === "sleep") {
    yield* tell(
      <>
        <h1>You win!</h1>
        <>
          You go back to sleep and die peacefully from Carbon Monoxide
          poisoning, thanks to a poorly maintained gas fire. Not a bad way to
          go.
        </>
      </>
    );
    return;
  }
  
  if (choice === "run") {
    yield* tell(
      <>
        <h1>You lose!</h1>
        <>
          You run away and die violently in an accident with agricultural
          machinery. What a horrible way to go.
        </>
      </>
    );
    return;
  }
  if (choice === "spy") {
    yield* tell(
      <>
        <h1>You lose!</h1>
        <>
          You run away and die violently in an accident with agricultural
          machinery. What a horrible way to go.
        </>
      </>
    );
    return;
  }
  
  // should never be reached 
  choice satisfies never
};
