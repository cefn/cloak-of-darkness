import { createStore } from "@lauf/store";
import { createContext, useContext } from "react";
import { ReaderState } from "./types";

export function initialiseReaderState(): ReaderState {
  return {
    title: <></>,
    page: {
      kind: "empty",
    },
  };
}

export const ReaderStoreContext = createContext(
  createStore<ReaderState>(initialiseReaderState())
);

export function useReaderStore() {
  return useContext(ReaderStoreContext);
}
