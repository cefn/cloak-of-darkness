import { useSelected } from "@lauf/store-react";
import { ReactNode } from "react";
import { Passage } from "../../engine/types";
import { useReaderStore } from "../context";

interface PassagePaneProps {
  passage: Passage;
  children: ReactNode;
}

export function PassagePane({ passage, children }: PassagePaneProps) {
  const store = useReaderStore();
  const title = useSelected(store, (state) => state.title);

  return (
    <div className="flex flex-row h-full">
      <article className="prose text-2xl w-3/4 bg-base-300 p-3 h-full">
        <h1>{title}</h1>
        {passage}
      </article>
      <div className="w-1/4">{children}</div>
    </div>
  );
}
