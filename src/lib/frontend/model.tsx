import { createStore } from "@lauf/store";
import { PromptFn, TellFn, TitleFn } from "../engine/types";
import { Prompt } from "./components/Prompt";
import { Tell } from "./components/Tell";

export interface UiState {
  title: JSX.Element;
  ui: JSX.Element;
}

function initUiState(): UiState {
  return {
    title: <></>,
    ui: <></>,
  };
}

export function createModel() {
  const store = createStore(initUiState());

  const title: TitleFn = async function ({ passage }) {
    store.write({
      ...store.read(),
      title: passage,
    });
  };

  const tell: TellFn = async function ({ passage }) {
    return new Promise<void>((resolve) =>
      store.write({
        ...store.read(),
        ui: <Tell passage={passage} next={() => resolve()} />,
      })
    );
  };

  const prompt: PromptFn = async function ({ passage, choices }) {
    return new Promise<keyof typeof choices>((resolve) =>
      store.write({
        ...store.read(),
        ui: (
          <Prompt
            passage={passage}
            choices={choices}
            choose={(choice) => resolve(choice)}
          />
        ),
      })
    );
  };

  return {
    store,
    title,
    tell,
    prompt,
  };
}
