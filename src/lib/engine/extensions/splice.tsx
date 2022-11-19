import { decorateSequence } from "../../util";
import { Action, ActionSequence, Passage } from "../types";

function addPrefix(action: Action, passageBefore: Passage): Action {
  return {
    ...action,
    passage: (
      <>
        {passageBefore}
        {action.passage}
      </>
    ),
  };
}

function addSuffix(action: Action, passageAfter: Passage): Action {
  return {
    ...action,
    passage: (
      <>
        {action.passage}
        {passageAfter}
      </>
    ),
  };
}

export function prefixPassages<Ret>(
  sequence: ActionSequence<Ret>,
  title: Passage
): ActionSequence<Ret> {
  return decorateSequence(sequence, (action: Action) =>
    addPrefix(action, title)
  );
}

export function suffixPassages<Ret>(
  sequence: ActionSequence<Ret>,
  title: Passage
): ActionSequence<Ret> {
  return decorateSequence(sequence, (action: Action) =>
    addSuffix(action, title)
  );
}
