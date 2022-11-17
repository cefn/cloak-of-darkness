import React from "react";
import ReactDOM from "react-dom/client";
import { createStore } from "@lauf/store";
import { readSequence } from "./lib/frontend/read";
import { roomStory } from "./lib/engine/formats/room";
import { initialiseReaderState } from "./lib/frontend/context";
import { Reader } from "./lib/frontend/components/Reader";

// Load the story
import { createRooms, createWorldState } from "./stories/cloak-of-darkness";

// create the watchable ReaderState
const readerStore = createStore(initialiseReaderState());

async function readForever() {
  for (;;) {
    // create the ActionSequence
    const sequence = roomStory({
      createRooms,
      createWorldState,
    });
    // perform ActionSequence, updating the ReaderState
    await readSequence(sequence, readerStore);
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
