import { ReduxContext } from "./context";

import type { ComponentChildren, JSX } from "preact";
import type { AnyAction, Store } from "redux";

export interface StoreProviderProps<A extends AnyAction = AnyAction> {
    children?: ComponentChildren;
    store: Store<any, A>;
}

export const ReduxProvider = <A extends AnyAction = AnyAction>({
    children,
    store,
}: StoreProviderProps<A>): JSX.Element => (
    <ReduxContext.Provider value={{ store: store as unknown as Store }}>
        {children}
    </ReduxContext.Provider>
);
