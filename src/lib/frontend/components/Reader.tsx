import { Store } from "@lauf/store";
import { useSelected } from "@lauf/store-react";
import { unhandled } from "../../util";
import { ReaderStoreContext } from "../context";
import { ReaderState } from "../types";
import { End } from "./End";
import { Prompt } from "./Prompt";
import { Tell } from "./Tell";

type PageKind = ReaderState["page"]["kind"];

function renderKind(kind: PageKind) {
  if (kind === "empty") {
    return <p>Story not yet loaded</p>;
  } else if (kind === "tell") {
    return <Tell />;
  } else if (kind === "prompt") {
    return <Prompt />;
  } else if (kind === "end") {
    return <End />;
  } else {
    unhandled(kind);
  }
}

export function Reader(props: { readerStore: Store<ReaderState> }) {
  const kind = useSelected(props.readerStore, (state) => state.page.kind);
  return (
    <ReaderStoreContext.Provider value={props.readerStore}>
      {renderKind(kind)}
    </ReaderStoreContext.Provider>
  );
}
