import type { GUESS_COUNT, GUESS_LETTER_COUNT } from "../constants";
import type * as error from "./error";
import type * as result from "./result";
import type { Tuple, TupleIndex } from "./tuple";

export type GuessLetterResult = result.Result<void, error.letter.LetterError>;

export type GuessLetterIndex = TupleIndex<typeof GUESS_LETTER_COUNT>;
export type GuessLetterIndexInclusive = Partial<
    Tuple<unknown, typeof GUESS_LETTER_COUNT>
>["length"];

export type GuessResult = result.Result<
    Tuple<GuessLetterResult, typeof GUESS_LETTER_COUNT>,
    error.guess.GuessError
>;

export type GuessIndex = TupleIndex<typeof GUESS_COUNT>;
export type GuessIndexInclusive = Partial<
    Tuple<unknown, typeof GUESS_COUNT>
>["length"];
