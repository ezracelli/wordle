import {
    useDebugValue,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "preact/hooks";

export const useSyncExternalStore = <T>(
    subscribe: (handleStoreChange: () => void) => () => void,
    getSnapshot: () => T,
    // @ts-expect-error(6133) unused in this implementation
    getServerSnapshot?: undefined | (() => T) | null,
): T => {
    const [{}, forceUpdate] = useState({});

    const value = getSnapshot();
    const instance = useRef({ getSnapshot, value });

    useLayoutEffect(() => {
        instance.current.getSnapshot = getSnapshot;
        instance.current.value = value;

        if (checkIfSnapshotChanged(instance.current)) {
            forceUpdate({});
        }
    }, [getSnapshot, subscribe, value]);

    useEffect(() => {
        if (checkIfSnapshotChanged(instance.current)) {
            forceUpdate({});
        }

        const handleStoreChange = () => {
            if (checkIfSnapshotChanged(instance.current)) {
                forceUpdate({});
            }
        };

        return subscribe(handleStoreChange);
    }, [subscribe]);

    useDebugValue(value);
    return value;
};

const checkIfSnapshotChanged = <T>(instance: {
    getSnapshot: () => T;
    value: T;
}): boolean => !Object.is(instance.value, instance.getSnapshot());
