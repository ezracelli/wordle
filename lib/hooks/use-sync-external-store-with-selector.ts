import { useDebugValue, useEffect, useMemo, useRef } from "preact/hooks";

import { useSyncExternalStore } from ".";

export const useSyncExternalStoreWithSelector = <T, U>(
    subscribe: (handleStoreChange: () => void) => () => void,
    getSnapshot: () => T,
    getServerSnapshot: undefined | (() => T) | null,
    selector: (snapshot: T) => U,
    isEqual?: (currentSelection: U, nextSelection: U) => boolean,
): U => {
    const instance = useRef<
        | {
              hasValue: true;
              value: U;
          }
        | {
              hasValue: false;
              value: null;
          }
    >({
        hasValue: false,
        value: null,
    });

    const [getSelection, getServerSelection] = useMemo(() => {
        let hasMemo = false;

        let memoizedSnapshot: T;
        let memoizedSelection: U;

        const memoizedSelector = (nextSnapshot: T): U => {
            if (!hasMemo) {
                hasMemo = true;
                memoizedSnapshot = nextSnapshot;
                const nextSelection = selector(nextSnapshot);

                if (isEqual) {
                    if (instance.current.hasValue) {
                        const currentSelection = instance.current.value;
                        if (isEqual(currentSelection, nextSelection)) {
                            memoizedSelection = currentSelection;
                            return currentSelection;
                        }
                    }
                }

                memoizedSelection = nextSelection;

                return nextSelection;
            }

            const previousSnapshot = memoizedSnapshot;
            const previousSelection = memoizedSelection;

            if (Object.is(previousSnapshot, nextSnapshot)) {
                return previousSelection;
            }

            const nextSelection = selector(nextSnapshot);

            if (isEqual?.(previousSelection, nextSelection)) {
                return previousSelection;
            }

            memoizedSnapshot = nextSnapshot;
            memoizedSelection = nextSelection;

            return nextSelection;
        };

        const getSnapshotWithSelector = () => memoizedSelector(getSnapshot());
        const getServerSnapshotWithSelector =
            getServerSnapshot && (() => memoizedSelector(getServerSnapshot()));

        return [getSnapshotWithSelector, getServerSnapshotWithSelector];
    }, [getSnapshot, getServerSnapshot, isEqual, selector]);

    const value = useSyncExternalStore(
        subscribe,
        getSelection,
        getServerSelection,
    );

    useEffect(() => {
        instance.current.hasValue = true;
        instance.current.value = value;
    }, [value]);

    useDebugValue(value);
    return value;
};
