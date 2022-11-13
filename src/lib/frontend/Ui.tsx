import { Store } from "@lauf/store";
import { useSelected } from "@lauf/store-react";
import { UiState } from "./model";

export function Ui(props: { store: Store<UiState> }) {
  const { store } = props;
  const ui = useSelected(store, (state) => state.ui);
  return <>{ui}</>;
}
