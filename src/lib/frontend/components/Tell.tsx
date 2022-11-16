import { TellOptions } from "../../engine/types";
import { Button } from "react-daisyui";
import { PassagePane } from "./PassagePane";

export const Tell = ({ passage, next }: TellOptions & { next: () => void }) => (
  <PassagePane passage={passage}>
    <div className="flex flex-col">
      <Button color="secondary" className="w-fit m-1" onClick={next}>
        Next
      </Button>
    </div>
  </PassagePane>
);
