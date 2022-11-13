import { createQueue } from "@lauf/queue";
import { createStore } from "@lauf/store";
import { PromptFn, TellFn } from "../story/types";

type Completed = TellCompleted | PromptCompleted<any>;

interface TellCompleted {
  kind: "tell";
}

interface PromptCompleted<ChoiceId> {
  kind: "prompt";
  choiceId: ChoiceId;
}

interface FictionStore {
  page: JSX.Element;
}

function initFictionStore(): FictionStore {
  return {
    page: <>Begin story</>,
  };
}

function createModel() {
  const fictionStore = createStore(initFictionStore());
  const completedQueue = createQueue<Completed>();

  async function awaitCompletedEvent<Kind extends Completed["kind"]>(
    kind: Kind
  ) {
    const completed = await completedQueue.receive();
    if (completed.kind !== kind) {
      throw new Error(`Event of kind ${completed.kind} not ${kind}`);
    }
    return completed as Completed & { kind: Kind };
  }

  const tell: TellFn = async function ({ passage }) {
    fictionStore.write({
      ...fictionStore.read(),
      page: (
        <>
          {passage}
          <button onClick={() => completedQueue.send({ kind: "tell" })}>
            Next Page
          </button>
        </>
      ),
    });
    await awaitCompletedEvent("tell");
  };

  const prompt: PromptFn = async function ({ passage, choices }) {
    fictionStore.write({
      ...fictionStore.read(),
      page: (
        <>
          {passage}
          {Object.entries(choices).map(([choiceId, choicePassage]) => (
            <button
              onClick={() =>
                completedQueue.send({
                  kind: "prompt",
                  choiceId,
                })
              }
            >
              {choicePassage as JSX.Element}
            </button>
          ))}
        </>
      ),
    });
    const promptEvent = await awaitCompletedEvent("prompt");
    return promptEvent.choiceId;
  };
}
