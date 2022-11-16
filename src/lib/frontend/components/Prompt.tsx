import { useSelected } from "@lauf/store-react";
import { Button } from "react-daisyui";
import { safeEntries } from "../../util";
import { useReaderStore } from "../context";
import { PassagePane } from "./PassagePane";

export function Prompt() {
  const page = useSelected(useReaderStore(), (state) => state.page);

  if (!(page.kind === "prompt")) {
    return <></>;
  }

  const { passage, choices, selectChoice } = page;

  return (
    <PassagePane passage={passage}>
      <div className="flex flex-col">
        {safeEntries(choices).map(([choiceId, choicePassage]) => {
          return (
            <Button
              color="primary"
              className="w-fit m-1"
              onClick={() => selectChoice(choiceId)}
            >
              {choicePassage}
            </Button>
          );
        })}
      </div>
    </PassagePane>
  );
}
