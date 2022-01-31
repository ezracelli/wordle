import { useDebugValue } from "preact/hooks";

import { useSyncExternalStoreWithSelector } from "~/lib/hooks";

import { useStore } from ".";

export const useSelector = <TState, TSelected>(
    selector: (state: TState) => TSelected,
    equalityFn?: (
        currentSelection: TSelected,
        nextSelection: TSelected,
    ) => boolean,
): TSelected => {
    const store = useStore<TState>();

    const selectedState = useSyncExternalStoreWithSelector(
        store.subscribe,
        store.getState,
        store.getState,
        selector,
        equalityFn,
    );

    useDebugValue(selectedState);
    return selectedState;
};

export type TypedUseSelectorHook<TState> = <TSelected>(
    selector: (state: TState) => TSelected,
) => TSelected;
