import { Store } from "@lauf/store";
import { useSelected } from "@lauf/store-react";
import { ReaderStoreContext, useReaderStore } from "../context";
import { ReaderState } from "../types";
import { Prompt } from "./Prompt";
import { Tell } from "./Tell";

interface UiProps {
  store: Store<ReaderState>;
}

export function Ui({ store }: UiProps) {
  const kind = useSelected(store, (state) => state.page.kind);
  return (
    <ReaderStoreContext.Provider value={store}>
      {kind === "empty" ? (
        <p>Story not yet loaded</p>
      ) : kind === "tell" ? (
        <Tell />
      ) : kind === "prompt" ? (
        <Prompt />
      ) : null}
    </ReaderStoreContext.Provider>
  );
}
