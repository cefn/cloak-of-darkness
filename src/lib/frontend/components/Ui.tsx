import { Store } from "@lauf/store";
import { useSelected } from "@lauf/store-react";
import { ReaderStoreContext } from "../context";
import { ReaderState } from "../types";
import { Prompt } from "./Prompt";
import { Tell } from "./Tell";

export function Ui(props: { store: Store<ReaderState> }) {
  const kind = useSelected(props.store, (state) => state.page.kind);
  return (
    <ReaderStoreContext.Provider value={props.store}>
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
