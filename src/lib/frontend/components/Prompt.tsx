import { PromptOptions } from "../../engine/types";
import { Button, ButtonGroup } from "react-daisyui";
import { PassagePane } from "./PassagePane";

export function Prompt<ChoiceId extends string>({
  passage,
  choices,
  choose,
}: PromptOptions<ChoiceId> & { choose: (choice: ChoiceId) => void }) {
  return (
    <PassagePane passage={passage}>
      <div className="flex flex-col">
        {Object.entries(choices).map((entry) => {
          const [choiceId, choicePassage] = entry as [
            keyof typeof choices,
            JSX.Element
          ];
          return (
            <Button
              color="warning"
              className="w-fit m-1"
              onClick={() => choose(choiceId)}
            >
              {choicePassage}
            </Button>
          );
        })}
      </div>
    </PassagePane>
  );
}
