import { ReactNode } from "react";
import { Passage } from "../../engine/types";

interface PassagePaneProps {
  passage: Passage;
  children: ReactNode;
}

export function PassagePane({ passage, children }: PassagePaneProps) {
  return (
    <div className="flex flex-row h-full">
      <article className="prose w-3/4 bg-base-300 p-3 h-full">
        {passage}
      </article>
      <div className="w-1/4">{children}</div>
    </div>
  );
}
