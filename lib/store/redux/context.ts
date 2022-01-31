import { createContext } from "preact";

import type { Action, AnyAction, Store } from "redux";

export interface ReduxContextValue<
    TState = any,
    TAction extends Action = AnyAction,
> {
    store: Store<TState, TAction>;
}

export const ReduxContext = createContext<ReduxContextValue | null>(null);
