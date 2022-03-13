import { createSelector } from "@reduxjs/toolkit";

import { GUESS_COUNT } from "../../constants";
import { GameState } from "../game-state";

import type { GuessIndex, GuessLetterIndex, GuessLetterResult } from "../guess";
import type { GuessesState, StatisticsState } from "./slices";

export const guessesStateSelector = (state: { guesses: GuessesState }) =>
    state.guesses;

export const currentGuessIndexSelector = (state: { guesses: GuessesState }) =>
    state.guesses.currentGuessIndex;

export const gameStateSelector = createSelector(
    [guessesStateSelector, currentGuessIndexSelector],
    ({ guesses }, currentGuessIndex) => {
        const { result: lastGuessResult } = guesses[currentGuessIndex - 1] ?? {
            result: null,
        };

        if (
            lastGuessResult &&
            lastGuessResult.variant === "Result::Ok" &&
            lastGuessResult.data.every(
                (lastGuessLetterResult) =>
                    lastGuessLetterResult.variant === "Result::Ok",
            )
        ) {
            return GameState.Won();
        } else if (currentGuessIndex === GUESS_COUNT) {
            return GameState.Lost();
        } else {
            return GameState.InProgress();
        }
    },
);

export const guessResultsSelector = createSelector(
    [guessesStateSelector],
    ({ guesses }) => guesses.map((guess) => guess.result),
);

export const guessResultSelector = createSelector(
    [guessesStateSelector, (_state, guessIndex: GuessIndex) => guessIndex],
    ({ guesses }, guessIndex) => guesses[guessIndex].result,
);

export const guessLetterSelector = createSelector(
    [
        guessesStateSelector,
        (_state, guessIndex: GuessIndex) => guessIndex,
        (_state, _guessIndex, guessLetterIndex: GuessLetterIndex) =>
            guessLetterIndex,
    ],
    ({ guesses }, guessIndex, guessLetterIndex) =>
        guesses[guessIndex].value[guessLetterIndex],
);

export const guessLetterResultSelector = createSelector(
    [
        guessesStateSelector,
        (_state, guessIndex: GuessIndex) => guessIndex,
        (_state, _guessIndex, guessLetterIndex: GuessLetterIndex) =>
            guessLetterIndex,
    ],
    ({ guesses }, guessIndex, guessLetterIndex) => {
        const guessResult = guesses[guessIndex].result;
        if (guessResult === null) return null;
        if (guessResult.variant === "Result::Err") return null;

        return guessResult.data[guessLetterIndex];
    },
);

export const letterResultsSelector = createSelector(
    [guessesStateSelector],
    ({ guesses }) => {
        const letterResults = new Map<string, GuessLetterResult>();

        for (const guess of guesses) {
            if (guess.result?.variant !== "Result::Ok") continue;

            for (const i in guess.value) {
                const letter = guess.value[i];
                if (!letter) continue;

                const letterResult = guess.result.data[i];
                if (!letterResult) continue;

                const existingLetterResult = letterResults.get(letter);
                if (existingLetterResult) {
                    const isLetterResultBetterThanExisting =
                        letterResult.variant === "Result::Ok" ||
                        (existingLetterResult.variant === "Result::Err" &&
                            letterResult.data.variant ===
                                "LetterError::IncorrectPosition");

                    if (isLetterResultBetterThanExisting) {
                        letterResults.set(letter, letterResult);
                    }
                } else {
                    letterResults.set(letter, letterResult);
                }
            }
        }

        return letterResults;
    },
);

export const statisticsStateSelector = (state: {
    statistics: StatisticsState;
}) => state.statistics;
