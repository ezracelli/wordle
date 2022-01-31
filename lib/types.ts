import type { GUESS_COUNT, GUESS_LETTER_COUNT } from "~/lib/constants";

export type GuessIndex = TupleIndex<typeof GUESS_COUNT>;

export type GuessIndexInclusive = Partial<
    Tuple<unknown, typeof GUESS_COUNT>
>["length"];

export type GuessLetterIndex = TupleIndex<typeof GUESS_LETTER_COUNT>;

export type GuessLetterIndexInclusive = Partial<
    Tuple<unknown, typeof GUESS_LETTER_COUNT>
>["length"];

export type Tuple<T, N extends number> = N extends N
    ? number extends N
        ? T[]
        : _TupleOf<T, N, []>
    : never;

type _TupleOf<T, N extends number, R extends unknown[]> = R["length"] extends N
    ? R
    : _TupleOf<T, N, [T, ...R]>;

export type TupleIndex<N extends number> = Exclude<
    Partial<Tuple<unknown, N>>["length"],
    Tuple<unknown, N>["length"]
>;
