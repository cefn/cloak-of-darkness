import { useSelected } from "@lauf/store-react";
import { Button } from "react-daisyui";
import { useReaderStore } from "../context";
import { PassagePane } from "./PassagePane";

export function End() {
  const page = useSelected(useReaderStore(), (state) => state.page);

  if (!(page.kind === "end")) {
    return <></>;
  }

  const passage = <>Press restart to play again</>;

  return (
    <PassagePane passage={passage}>
      <div className="flex flex-col">
        <Button color="accent" className="w-fit m-1" onClick={page.restart}>
          Restart
        </Button>
      </div>
    </PassagePane>
  );
}
