import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";

import {
    currentGuessIndexSelector,
    gameStateSelector,
    guessLetterSelector,
    guessLetterResultSelector,
    guessResultSelector,
    statisticsStateSelector,
    guessResultsSelector,
    letterResultsSelector,
} from "./selectors";
import * as slices from "./slices";

import type { TypedUseSelectorHook } from "react-redux";
import type { GuessIndex, GuessLetterIndex } from "../guess";

export const store = configureStore({
    reducer: {
        [slices.guesses.name]: slices.guesses.reducer,
        [slices.statistics.name]: slices.statistics.reducer,
    },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;

export const useCurrentGuessIndex = () =>
    useAppSelector(currentGuessIndexSelector);

export const useGameState = () => useAppSelector(gameStateSelector);

export const useGuessResults = () => useAppSelector(guessResultsSelector);

export const useGuessResult = (guessIndex: GuessIndex) =>
    useAppSelector((state) => guessResultSelector(state, guessIndex));

export const useGuessLetter = (
    guessIndex: GuessIndex,
    guessLetterIndex: GuessLetterIndex,
) =>
    useAppSelector((state) =>
        guessLetterSelector(state, guessIndex, guessLetterIndex),
    );

export const useGuessLetterResult = (
    guessIndex: GuessIndex,
    guessLetterIndex: GuessLetterIndex,
) =>
    useAppSelector((state) =>
        guessLetterResultSelector(state, guessIndex, guessLetterIndex),
    );

export const useLetterResults = () => useAppSelector(letterResultsSelector);

export const useStatisticsState = () => useAppSelector(statisticsStateSelector);

export const {
    fetchAnswer,
    fetchResultForCurrentGuess,
    popLetterFromCurrentGuess,
    pushLetterToCurrentGuess,
    replaceGuessesState,
    replaceStatisticsState,
    resetGuessesState,
    updateStatistics,
} = slices;
