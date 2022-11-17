import React from "react";
import ReactDOM from "react-dom/client";
import { createStore } from "@lauf/store";
import { Reader } from "./lib/frontend/components/Reader";
import { initialiseReaderState } from "./lib/frontend/context";
import { readStory } from "./lib/frontend/read";
import { roomStory } from "./lib/engine/formats/room";

// Load the story
import { createRooms, createWorldState } from "./stories/cloak-of-darkness";

// create sequence of story actions
const sequence = roomStory({
  createRooms,
  createWorldState,
});

// create ui store
const readerStore = createStore(initialiseReaderState());

// perform story actions against ui store
readStory(sequence, readerStore);

// render the store
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="flex flex-col min-w-full h-screen">
      <Reader readerStore={readerStore} />
    </div>
  </React.StrictMode>
);
