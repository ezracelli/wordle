type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
    ? R
    : _TupleOf<T, N, [T, ...R]>;

export type Tuple<T, N extends number> = N extends N
    ? number extends N
        ? T[]
        : _TupleOf<T, N, []>
    : never;

export type TupleIndex<N extends number> = Exclude<
    Partial<Tuple<unknown, N>>["length"],
    Tuple<unknown, N>["length"]
>;

export const makeTuple = <T, N extends number>(
    length: N,
    initialValue: T | ((index: TupleIndex<N>) => T),
): Tuple<T, N> => {
    return Array.from({ length }, (_, index) =>
        typeof initialValue === "function"
            ? (initialValue as (index: TupleIndex<N>) => T)(
                  index as TupleIndex<N>,
              )
            : initialValue,
    ) as Tuple<T, N>;
};
