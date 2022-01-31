import type { Tuple, TupleIndex } from "~/lib/types";

export const makeTuple = <T, N extends number>(
    length: N,
    mapfn: (i: TupleIndex<N>) => T,
): Tuple<T, N> =>
    Array.from({ length }, (_, i) => mapfn(i as TupleIndex<N>)) as Tuple<T, N>;
