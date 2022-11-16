import { createStore } from "@lauf/store";
import { PromptFn, TellFn } from "../engine/types";

export interface UiState {
  ui: JSX.Element;
}

function initUiState(): UiState {
  return {
    ui: <>Begin story</>,
  };
}

export function createModel() {
  const store = createStore(initUiState());

  const tell: TellFn = async function ({ passage }) {
    return new Promise<void>((resolve) =>
      store.write({
        ui: (
          <>
            {passage}
            <div>
              <button onClick={() => resolve()}>Next</button>
            </div>
          </>
        ),
      })
    );
  };

  const prompt: PromptFn = async function ({ passage, choices }) {
    return new Promise<keyof typeof choices>((resolve) =>
      store.write({
        ui: (
          <>
            {passage}
            {Object.entries(choices).map((entry) => {
              const [choiceId, choicePassage] = entry as [
                keyof typeof choices,
                JSX.Element
              ];
              return (
                <div>
                  <button onClick={() => resolve(choiceId)}>
                    {choicePassage}
                  </button>
                </div>
              );
            })}
          </>
        ),
      })
    );
  };

  return {
    store,
    tell,
    prompt,
  };
}
