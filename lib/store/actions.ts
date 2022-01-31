import {
    GuessAnimation,
    GuessLetterAnimation,
    GuessLetterResult,
} from "~/lib/constants";
import { GuessIndexInclusive, GuessLetterIndexInclusive } from "~/lib/types";

export enum ActionType {
    DECREMENT_CURRENT_GUESS_INDEX = "DECREMENT_CURRENT_GUESS_INDEX",
    DECREMENT_CURRENT_GUESS_LETTER_INDEX = "DECREMENT_CURRENT_GUESS_LETTER_INDEX",
    INCREMENT_CURRENT_GUESS_INDEX = "INCREMENT_CURRENT_GUESS_INDEX",
    INCREMENT_CURRENT_GUESS_LETTER_INDEX = "INCREMENT_CURRENT_GUESS_LETTER_INDEX",
    SET_CURRENT_GUESS_INDEX = "SET_CURRENT_GUESS_INDEX",
    SET_CURRENT_GUESS_LETTER_INDEX = "SET_CURRENT_GUESS_LETTER_INDEX",
    SET_GUESS_ANIMATION = "SET_GUESS_ANIMATION",
    SET_GUESS_LETTER_ANIMATION = "SET_GUESS_LETTER_ANIMATION",
    SET_GUESS_LETTER_RESULT = "SET_GUESS_LETTER_RESULT",
    SET_GUESS_LETTER_VALUE = "SET_GUESS_LETTER_VALUE",
}

export interface DecrementCurrentGuessIndexAction {
    type: ActionType.DECREMENT_CURRENT_GUESS_INDEX;
}

export const decrementCurrentGuessIndex =
    (): DecrementCurrentGuessIndexAction => ({
        type: ActionType.DECREMENT_CURRENT_GUESS_INDEX,
    });

export interface DecrementCurrentGuessLetterIndexAction {
    type: ActionType.DECREMENT_CURRENT_GUESS_LETTER_INDEX;
}

export const decrementCurrentGuessLetterIndex =
    (): DecrementCurrentGuessLetterIndexAction => ({
        type: ActionType.DECREMENT_CURRENT_GUESS_LETTER_INDEX,
    });

export interface IncrementCurrentGuessIndexAction {
    type: ActionType.INCREMENT_CURRENT_GUESS_INDEX;
}

export const incrementCurrentGuessIndex =
    (): IncrementCurrentGuessIndexAction => ({
        type: ActionType.INCREMENT_CURRENT_GUESS_INDEX,
    });

export interface IncrementCurrentGuessLetterIndexAction {
    type: ActionType.INCREMENT_CURRENT_GUESS_LETTER_INDEX;
}

export const incrementCurrentGuessLetterIndex =
    (): IncrementCurrentGuessLetterIndexAction => ({
        type: ActionType.INCREMENT_CURRENT_GUESS_LETTER_INDEX,
    });

export interface SetCurrentGuessIndexAction {
    payload: {
        guessIndex: GuessIndexInclusive;
    };
    type: ActionType.SET_CURRENT_GUESS_INDEX;
}

export const setCurrentGuessIndex = (
    guessIndex: GuessIndexInclusive,
): SetCurrentGuessIndexAction => ({
    payload: { guessIndex },
    type: ActionType.SET_CURRENT_GUESS_INDEX,
});

export interface SetCurrentGuessLetterIndexAction {
    payload: {
        guessLetterIndex: GuessLetterIndexInclusive;
    };
    type: ActionType.SET_CURRENT_GUESS_LETTER_INDEX;
}

export const setCurrentGuessLetterIndex = (
    guessLetterIndex: GuessLetterIndexInclusive,
): SetCurrentGuessLetterIndexAction => ({
    payload: { guessLetterIndex },
    type: ActionType.SET_CURRENT_GUESS_LETTER_INDEX,
});

export interface SetGuessAnimationAction {
    payload: {
        guessAnimation: GuessAnimation | null;
        guessIndex?: GuessIndexInclusive;
    };
    type: ActionType.SET_GUESS_ANIMATION;
}

export const setGuessAnimation = (
    guessAnimation: GuessAnimation | null,
    guessIndex?: GuessIndexInclusive,
): SetGuessAnimationAction => ({
    payload: { guessAnimation, guessIndex },
    type: ActionType.SET_GUESS_ANIMATION,
});

export interface SetGuessLetterAnimationAction {
    payload: {
        guessIndex?: GuessIndexInclusive;
        guessLetterAnimation: GuessLetterAnimation | null;
        guessLetterIndex?: GuessLetterIndexInclusive;
    };
    type: ActionType.SET_GUESS_LETTER_ANIMATION;
}

export const setGuessLetterAnimation = (
    guessLetterAnimation: GuessLetterAnimation | null,
    guessIndex?: GuessIndexInclusive,
    guessLetterIndex?: GuessLetterIndexInclusive,
): SetGuessLetterAnimationAction => ({
    payload: { guessIndex, guessLetterAnimation, guessLetterIndex },
    type: ActionType.SET_GUESS_LETTER_ANIMATION,
});

export interface SetGuessLetterResultAction {
    payload: {
        guessIndex?: GuessIndexInclusive;
        guessLetterResult: GuessLetterResult;
        guessLetterIndex?: GuessLetterIndexInclusive;
    };
    type: ActionType.SET_GUESS_LETTER_RESULT;
}

export const setGuessLetterResult = (
    guessLetterResult: GuessLetterResult,
    guessIndex?: GuessIndexInclusive,
    guessLetterIndex?: GuessLetterIndexInclusive,
): SetGuessLetterResultAction => ({
    payload: { guessIndex, guessLetterIndex, guessLetterResult },
    type: ActionType.SET_GUESS_LETTER_RESULT,
});

export interface SetGuessLetterValueAction {
    payload: {
        guessIndex?: GuessIndexInclusive;
        guessLetterValue: string | null;
        guessLetterIndex?: GuessLetterIndexInclusive;
    };
    type: ActionType.SET_GUESS_LETTER_VALUE;
}

export const setGuessLetterValue = (
    guessLetterValue: string | null,
    guessIndex?: GuessIndexInclusive,
    guessLetterIndex?: GuessLetterIndexInclusive,
): SetGuessLetterValueAction => ({
    payload: { guessIndex, guessLetterIndex, guessLetterValue },
    type: ActionType.SET_GUESS_LETTER_VALUE,
});
