import { createSlice } from "@reduxjs/toolkit";

import { gameStateSelector } from "../selectors";

import type { PayloadAction } from "@reduxjs/toolkit";
import type { GuessIndex } from "../../guess";
import type { GuessesState } from "./guesses";

export interface StatisticsState {
    gameCount: number;
    guessesDistribution: Record<GuessIndex, number>;
    lossCount: number;
    maxStreakCount: number;
    streakCount: number;
    winCount: number;
}

export const initialState: StatisticsState = {
    gameCount: 0,
    guessesDistribution: {
        0: 0,
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
    },
    lossCount: 0,
    maxStreakCount: 0,
    streakCount: 0,
    winCount: 0,
};

export const statistics = createSlice({
    name: "statistics",
    initialState,
    reducers: {
        updateStatistics: (
            state,
            { payload: guessesState }: PayloadAction<GuessesState>,
        ) => {
            const gameState = gameStateSelector({ guesses: guessesState });
            // if (gameState.variant === "GameState::InProgress") return;

            state.gameCount++;

            if (gameState.variant === "GameState::Won") {
                state.guessesDistribution[
                    (guessesState.currentGuessIndex - 1) as GuessIndex
                ]++;
                state.winCount++;
                state.streakCount++;

                state.maxStreakCount = Math.max(
                    state.streakCount,
                    state.maxStreakCount,
                );
            } else {
                state.lossCount++;
                state.streakCount = 0;
            }
        },
        replaceStatisticsState: (
            _,
            { payload }: PayloadAction<StatisticsState>,
        ) => payload,
    },
});

export const { updateStatistics, replaceStatisticsState } = statistics.actions;
