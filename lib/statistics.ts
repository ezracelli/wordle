import type { GuessIndex } from "./guess";
import type { AppState } from "./store";

export interface Statistics {
    currentAppState: AppState | null;
    gameCount: number;
    guessesDistribution: Record<GuessIndex, number>;
    lossCount: number;
    maxStreakCount: number;
    streakCount: number;
    winCount: number;
}

export const initialState: Statistics = {
    currentAppState: null,
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
