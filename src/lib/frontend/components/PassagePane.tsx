import { useSelected } from "@lauf/store-react";
import { ReactNode } from "react";
import { Passage } from "../../engine/types";
import { useReaderStore } from "../context";

export function PassagePane(props: { passage: Passage; children: ReactNode }) {
  const title = useSelected(useReaderStore(), (state) => state.title);

  return (
    <div className="flex flex-row h-full">
      <article className="prose text-2xl w-3/4 bg-base-300 p-3 h-full">
        <h1>{title}</h1>
        {props.passage}
      </article>
      <div className="w-1/4">{props.children}</div>
    </div>
  );
}
