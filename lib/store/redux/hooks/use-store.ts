import { useContext } from "preact/hooks";

import { ReduxContext } from "../context";

import type { Action, AnyAction, Store } from "redux";

export const useStore = <
    TState = any,
    TAction extends Action = AnyAction,
>(): Store<TState, TAction> => {
    const reduxContextValue = useContext(ReduxContext);
    if (reduxContextValue === null) {
        throw new Error("missing `StoreProvider`");
    }

    return reduxContextValue.store as unknown as Store<TState, TAction>;
};
