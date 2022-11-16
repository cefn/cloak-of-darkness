import { Store } from "@lauf/store";
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

export const ReaderStoreContext = createContext<Store<ReaderState> | null>(
  null
);

export function useReaderStore() {
  const value = useContext(ReaderStoreContext);
  if (value === null) {
    throw new Error("No Reader store available");
  }
  return value;
}
