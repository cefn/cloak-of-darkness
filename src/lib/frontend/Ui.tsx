import { Store } from "@lauf/store";
import { useSelected } from "@lauf/store-react";
import { UiState } from "./model";

export function Ui(props: { store: Store<UiState> }) {
  const { store } = props;
  const title = useSelected(store, (state) => state.title);
  const ui = useSelected(store, (state) => state.ui);
  return (
    <>
      {title}
      {ui}
    </>
  );
}
