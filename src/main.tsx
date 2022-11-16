import { createStore } from "@lauf/store";
import React from "react";
import ReactDOM from "react-dom/client";
import { Ui } from "./lib/frontend/components/Ui";
import { initialiseReaderState } from "./lib/frontend/context";
import { read } from "./lib/frontend/read";
import { ReaderState } from "./lib/frontend/types";
import { story } from "./stories/cloak-of-darkness/story";

// Create store
const store = createStore<ReaderState>(initialiseReaderState());

// launch story which will write to store
read(story, store);

// render the store
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="flex flex-col min-w-full h-screen">
      <Ui store={store} />
    </div>
  </React.StrictMode>
);
