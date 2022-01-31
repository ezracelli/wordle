import type {
    GuessAnimation,
    GuessLetterAnimation,
    GuessLetterResult,
    GUESS_COUNT,
    GUESS_LETTER_COUNT,
} from "~/lib/constants";

import type {
    GuessIndexInclusive,
    GuessLetterIndexInclusive,
    Tuple,
} from "~/lib/types";
import type {
    DecrementCurrentGuessIndexAction,
    DecrementCurrentGuessLetterIndexAction,
    IncrementCurrentGuessIndexAction,
    IncrementCurrentGuessLetterIndexAction,
    SetCurrentGuessIndexAction,
    SetCurrentGuessLetterIndexAction,
    SetGuessAnimationAction,
    SetGuessLetterAnimationAction,
    SetGuessLetterResultAction,
    SetGuessLetterValueAction,
} from "./actions";

export interface GuessLetterState {
    animation: GuessLetterAnimation | null;
    result: GuessLetterResult | null;
    value: string | null;
}

export type GuessLettersState = Tuple<
    GuessLetterState,
    typeof GUESS_LETTER_COUNT
>;

export interface GuessState {
    animation: GuessAnimation | null;
    letters: GuessLettersState;
}

export type GuessesState = Tuple<GuessState, typeof GUESS_COUNT>;

export interface State {
    currentGuessIndex: GuessIndexInclusive;
    currentGuessLetterIndex: GuessLetterIndexInclusive;
    guesses: GuessesState;
}

export type Action =
    | DecrementCurrentGuessIndexAction
    | DecrementCurrentGuessLetterIndexAction
    | IncrementCurrentGuessIndexAction
    | IncrementCurrentGuessLetterIndexAction
    | SetCurrentGuessIndexAction
    | SetCurrentGuessLetterIndexAction
    | SetGuessAnimationAction
    | SetGuessLetterAnimationAction
    | SetGuessLetterResultAction
    | SetGuessLetterValueAction;
