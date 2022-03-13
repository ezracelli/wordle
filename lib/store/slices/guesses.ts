import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { GUESS_COUNT, GUESS_LETTER_COUNT } from "../../../constants";
import { makeTuple } from "../../tuple";
import { gameStateSelector } from "../selectors";

import type { PayloadAction } from "@reduxjs/toolkit";
import type {
    GuessIndexInclusive,
    GuessLetterIndexInclusive,
    GuessResult,
} from "../../guess";
import type { Tuple } from "../../tuple";
import type { AppState } from "..";

export interface GuessesState {
    currentGuessIndex: GuessIndexInclusive;
    currentGuessLetterIndex: GuessLetterIndexInclusive;
    guesses: Tuple<
        {
            result: GuessResult | null;
            value: Tuple<string | null, typeof GUESS_LETTER_COUNT>;
        },
        typeof GUESS_COUNT
    >;
}

const initialState: GuessesState = {
    currentGuessIndex: 0,
    currentGuessLetterIndex: 0,
    guesses: makeTuple(GUESS_COUNT, () => ({
        result: null,
        value: makeTuple(GUESS_LETTER_COUNT, () => null),
    })),
};

export const fetchAnswer = createAsyncThunk<string, void, { state: AppState }>(
    "guesses/fetchAnswer",
    async (_, { getState, signal }) => {
        const gameState = gameStateSelector(getState());
        if (gameState.variant === "GameState::InProgress") throw new Error();

        const guesses = getState().guesses.guesses.map((guess) =>
            guess.value.join(""),
        );

        const res = await fetch(
            `/api/answer?${new URLSearchParams([
                ["guesses", JSON.stringify(guesses)],
                ["tz", new Intl.DateTimeFormat().resolvedOptions().timeZone],
            ])}`,
            {
                signal,
            },
        );

        return await res.text();
    },
);

export const fetchResultForCurrentGuess = createAsyncThunk<
    GuessResult,
    void,
    {
        state: AppState;
    }
>(
    "guesses/fetchResultForCurrentGuessStatus",
    async (_, { getState, signal }) => {
        const { currentGuessIndex, guesses } = getState().guesses;
        if (currentGuessIndex === GUESS_COUNT) throw new Error();

        const currentGuess = guesses[currentGuessIndex];

        const res = await fetch("/api/guess", {
            body: new URLSearchParams([
                ["guess", currentGuess.value.join("")],
                ["tz", new Intl.DateTimeFormat().resolvedOptions().timeZone],
            ]),
            method: "POST",
            signal,
        });

        return (await res.json()) as GuessResult;
    },
);

export const guesses = createSlice({
    name: "guesses",
    initialState,
    reducers: {
        popLetterFromCurrentGuess: (state) => {
            if (state.currentGuessIndex === GUESS_COUNT) return;
            if (state.currentGuessLetterIndex === 0) return;

            state.currentGuessLetterIndex--;
            state.guesses[state.currentGuessIndex].value[
                state.currentGuessLetterIndex
            ] = null;
        },
        pushLetterToCurrentGuess: (
            state,
            { payload }: PayloadAction<string>,
        ) => {
            if (state.currentGuessIndex === GUESS_COUNT) return;
            if (state.currentGuessLetterIndex === GUESS_LETTER_COUNT) return;

            state.guesses[state.currentGuessIndex].value[
                state.currentGuessLetterIndex
            ] = payload;
            state.currentGuessLetterIndex++;
        },
        replaceGuessesState: (_, { payload }: PayloadAction<GuessesState>) =>
            payload,
        resetGuessesState: () => initialState,
    },
    extraReducers: (builder) => {
        // builder.addCase(fetchResultForCurrentGuess.pending)
        builder.addCase(
            fetchResultForCurrentGuess.fulfilled,
            (state, { payload }) => {
                if (state.currentGuessIndex === GUESS_COUNT) return;

                state.guesses[state.currentGuessIndex].result = payload;

                if (payload.variant === "Result::Ok") {
                    state.currentGuessIndex++;
                    state.currentGuessLetterIndex = 0;
                }
            },
        );
    },
});

export const {
    popLetterFromCurrentGuess,
    pushLetterToCurrentGuess,
    replaceGuessesState,
    resetGuessesState,
} = guesses.actions;
