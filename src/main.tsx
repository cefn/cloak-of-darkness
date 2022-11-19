import React from "react";
import ReactDOM from "react-dom/client";
import { createStore } from "@lauf/store";
import { readStory } from "./lib/frontend/read";
import { initialiseReaderState } from "./lib/frontend/context";
import { Reader } from "./lib/frontend/components/Reader";

// Load the story
import { menu } from "./stories/menu";

// create the watchable ReaderState
const readerStore = createStore(initialiseReaderState());

async function readForever() {
  for (;;) {
    // perform ActionSequence, updating the ReaderState
    await readStory(menu, readerStore);
  }
}

// launch the reader on a loop
readForever();

// render the store
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="flex flex-col min-w-full h-screen">
      <Reader readerStore={readerStore} />
    </div>
  </React.StrictMode>
);
