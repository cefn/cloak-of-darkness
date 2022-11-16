import React from "react";
import ReactDOM from "react-dom/client";
import { createModel } from "./lib/frontend/model";
import { Ui } from "./lib/frontend/Ui";
import { read } from "./lib/engine/read";
import { story } from "./stories/cloak-of-darkness/story";

/** Create a model defining async operations that manipulate a watchable JSX component */
const { title, tell, prompt, store } = createModel();

/** Launch the story, which will trigger the async operations */

read({ title, story, tell, prompt });

/** Set up a view that will render the watchable JSX component. */
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="flex flex-col min-w-full h-screen">
      <Ui store={store} />
    </div>
  </React.StrictMode>
);
