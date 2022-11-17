import { createStore } from "@lauf/store";
import React from "react";
import ReactDOM from "react-dom/client";
import { Ui } from "./lib/frontend/components/Ui";
import { initialiseReaderState } from "./lib/frontend/context";
import { readStory } from "./lib/frontend/read";
import {
  createWorld,
  createWorldState,
} from "./stories/cloak-of-darkness/content";
import { roomStory } from "./lib/engine/formats/room";

// launch story
const sequence = roomStory({ createWorld, createWorldState });

// create ui store
const store = createStore(initialiseReaderState());

// map the sequence of story actions into the ui store
readStory(sequence, store);

// render the store
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="flex flex-col min-w-full h-screen">
      <Ui store={store} />
    </div>
  </React.StrictMode>
);
