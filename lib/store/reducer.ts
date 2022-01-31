import { GUESS_COUNT, GUESS_LETTER_COUNT } from "~/lib/constants";
import { GuessIndex, GuessLetterIndex } from "~/lib/types";
import { makeTuple } from "~/lib/util";

import { ActionType } from "./actions";

import type {
    Action,
    GuessesState,
    GuessLettersState,
    GuessLetterState,
    GuessState,
    State,
} from "./types";

const initialState: State = {
    currentGuessIndex: 0,
    currentGuessLetterIndex: 0,
    guesses: makeTuple(GUESS_COUNT, () => ({
        animation: null,
        letters: makeTuple(GUESS_LETTER_COUNT, () => ({
            animation: null,
            result: null,
            value: null,
        })),
    })),
};

export const reducer = (state = initialState, action: Action): State => {
    switch (action.type) {
        case ActionType.DECREMENT_CURRENT_GUESS_INDEX: {
            if (state.currentGuessIndex === 0) {
                return state;
            }

            return {
                ...state,
                currentGuessIndex: (state.currentGuessIndex - 1) as GuessIndex,
            };
        }
        case ActionType.DECREMENT_CURRENT_GUESS_LETTER_INDEX: {
            if (state.currentGuessLetterIndex === 0) {
                return state;
            }

            return {
                ...state,
                currentGuessLetterIndex: (state.currentGuessLetterIndex -
                    1) as GuessLetterIndex,
            };
        }
        case ActionType.INCREMENT_CURRENT_GUESS_INDEX: {
            if (state.currentGuessIndex === GUESS_COUNT) {
                return state;
            }

            return {
                ...state,
                currentGuessIndex: (state.currentGuessIndex + 1) as GuessIndex,
            };
        }
        case ActionType.INCREMENT_CURRENT_GUESS_LETTER_INDEX: {
            if (state.currentGuessLetterIndex === GUESS_LETTER_COUNT) {
                return state;
            }

            return {
                ...state,
                currentGuessLetterIndex: (state.currentGuessLetterIndex +
                    1) as GuessLetterIndex,
            };
        }
        case ActionType.SET_CURRENT_GUESS_INDEX: {
            const { guessIndex } = action.payload;

            if (guessIndex === state.currentGuessIndex) {
                return state;
            }

            return {
                ...state,
                currentGuessIndex: guessIndex,
            };
        }
        case ActionType.SET_CURRENT_GUESS_LETTER_INDEX: {
            const { guessLetterIndex } = action.payload;

            if (guessLetterIndex === state.currentGuessLetterIndex) {
                return state;
            }

            return {
                ...state,
                currentGuessLetterIndex: guessLetterIndex,
            };
        }
        case ActionType.SET_GUESS_ANIMATION: {
            const { guessAnimation, guessIndex = state.currentGuessIndex } =
                action.payload;

            if (guessIndex === GUESS_COUNT) {
                return state;
            }

            if (guessAnimation === state.guesses[guessIndex].animation) {
                return state;
            }

            const guess: GuessState = {
                ...state.guesses[guessIndex],
                animation: guessAnimation,
            };

            return {
                ...state,
                guesses: [
                    ...state.guesses.slice(0, guessIndex),
                    guess,
                    ...state.guesses.slice(guessIndex + 1),
                ] as GuessesState,
            };
        }
        case ActionType.SET_GUESS_LETTER_ANIMATION: {
            const {
                guessIndex = state.currentGuessIndex,
                guessLetterAnimation,
                guessLetterIndex = state.currentGuessLetterIndex,
            } = action.payload;

            if (
                guessIndex === GUESS_COUNT ||
                guessLetterIndex === GUESS_LETTER_COUNT
            ) {
                return state;
            }

            if (
                guessLetterAnimation ===
                state.guesses[guessIndex].letters[guessLetterIndex].animation
            ) {
                return state;
            }

            const guessLetter: GuessLetterState = {
                ...state.guesses[guessIndex].letters[guessLetterIndex],
                animation: guessLetterAnimation,
            };

            const guess: GuessState = {
                ...state.guesses[guessIndex],
                letters: [
                    ...state.guesses[guessIndex].letters.slice(
                        0,
                        guessLetterIndex,
                    ),
                    guessLetter,
                    ...state.guesses[guessIndex].letters.slice(
                        guessLetterIndex + 1,
                    ),
                ] as GuessLettersState,
            };

            return {
                ...state,
                guesses: [
                    ...state.guesses.slice(0, guessIndex),
                    guess,
                    ...state.guesses.slice(guessIndex + 1),
                ] as GuessesState,
            };
        }
        case ActionType.SET_GUESS_LETTER_RESULT: {
            const {
                guessIndex = state.currentGuessIndex,
                guessLetterIndex = state.currentGuessLetterIndex,
                guessLetterResult,
            } = action.payload;

            if (
                guessIndex === GUESS_COUNT ||
                guessLetterIndex === GUESS_LETTER_COUNT
            ) {
                return state;
            }

            if (
                guessLetterResult ===
                state.guesses[guessIndex].letters[guessLetterIndex].result
            ) {
                return state;
            }

            const guessLetter: GuessLetterState = {
                ...state.guesses[guessIndex].letters[guessLetterIndex],
                result: guessLetterResult,
            };

            const guess: GuessState = {
                ...state.guesses[guessIndex],
                letters: [
                    ...state.guesses[guessIndex].letters.slice(
                        0,
                        guessLetterIndex,
                    ),
                    guessLetter,
                    ...state.guesses[guessIndex].letters.slice(
                        guessLetterIndex + 1,
                    ),
                ] as GuessLettersState,
            };

            return {
                ...state,
                guesses: [
                    ...state.guesses.slice(0, guessIndex),
                    guess,
                    ...state.guesses.slice(guessIndex + 1),
                ] as GuessesState,
            };
        }
        case ActionType.SET_GUESS_LETTER_VALUE: {
            const {
                guessIndex = state.currentGuessIndex,
                guessLetterIndex = state.currentGuessLetterIndex,
                guessLetterValue,
            } = action.payload;

            if (
                guessIndex === GUESS_COUNT ||
                guessLetterIndex === GUESS_LETTER_COUNT
            ) {
                return state;
            }

            if (
                guessLetterValue ===
                state.guesses[guessIndex].letters[guessLetterIndex].value
            ) {
                return state;
            }

            const guessLetter: GuessLetterState = {
                ...state.guesses[guessIndex].letters[guessLetterIndex],
                value: guessLetterValue,
            };

            const guess: GuessState = {
                ...state.guesses[guessIndex],
                letters: [
                    ...state.guesses[guessIndex].letters.slice(
                        0,
                        guessLetterIndex,
                    ),
                    guessLetter,
                    ...state.guesses[guessIndex].letters.slice(
                        guessLetterIndex + 1,
                    ),
                ] as GuessLettersState,
            };

            return {
                ...state,
                guesses: [
                    ...state.guesses.slice(0, guessIndex),
                    guess,
                    ...state.guesses.slice(guessIndex + 1),
                ] as GuessesState,
            };
        }
        default:
            return state;
    }
};
