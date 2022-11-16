import { useSelected } from "@lauf/store-react";
import { Button } from "react-daisyui";
import { useReaderStore } from "../context";
import { PassagePane } from "./PassagePane";

export function Tell() {
  const store = useReaderStore();
  const page = useSelected(store, (state) => state.page);

  if (!(page.kind === "tell")) {
    return <></>;
  }

  return (
    <PassagePane passage={page.passage}>
      <div className="flex flex-col">
        <Button color="secondary" className="w-fit m-1" onClick={page.turnPage}>
          Next
        </Button>
      </div>
    </PassagePane>
  );
}
