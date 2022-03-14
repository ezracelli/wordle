import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as ReduxProvider } from "react-redux";

import {
    GUESS_COUNT,
    GUESS_LETTER_COUNT,
    LOCALSTORAGE_KEY_DATE,
    LOCALSTORAGE_KEY_STATE,
} from "./constants";
import {
    replaceGuessesState,
    replaceStatisticsState,
    resetGuessesState,
    store,
    updateStatistics,
} from "./lib/store";
import { gameStateSelector } from "./lib/store/selectors";
import { makeTuple } from "./lib/tuple";

import { App } from "./App";

import type { AppState } from "./lib/store";

const container = document.getElementById("app");
if (container) {
    const root = createRoot(container);
    root.render(
        <StrictMode>
            <ReduxProvider store={store}>
                <App />
            </ReduxProvider>
        </StrictMode>,
    );
}

const now = new Date();
let today = new Date(now.valueOf() - now.getTimezoneOffset() * 60 * 1000)
    .toISOString()
    .split("T")[0]!;

const appState = JSON.parse(
    window.localStorage.getItem(LOCALSTORAGE_KEY_STATE) ?? "null",
) as AppState | null;

if (appState && window.localStorage.getItem(LOCALSTORAGE_KEY_DATE) === today) {
    store.dispatch(replaceGuessesState(appState.guesses));
    store.dispatch(replaceStatisticsState(appState.statistics));
}

let gameState = gameStateSelector(store.getState());

if (
    localStorage.getItem(LOCALSTORAGE_KEY_DATE) !== null &&
    today !== localStorage.getItem(LOCALSTORAGE_KEY_DATE)
) {
    if (gameState.variant === "GameState::InProgress") {
        const guessesState = store.getState().guesses;
        store.dispatch(updateStatistics(guessesState));
    }

    store.dispatch(resetGuessesState());
}

setInterval(() => {
    const now = new Date();
    const today_ = new Date(now.valueOf() - now.getTimezoneOffset() * 60 * 1000)
        .toISOString()
        .split("T")[0]!;

    if (today_ !== today) {
        today = today_;

        if (gameState.variant === "GameState::InProgress") {
            const guessesState = store.getState().guesses;
            store.dispatch(updateStatistics(guessesState));
        }

        store.dispatch(resetGuessesState());
    }
}, 1000 * 60);

store.subscribe(() => {
    const gameState_ = gameStateSelector(store.getState());
    if (
        gameState_.variant !== "GameState::InProgress" &&
        gameState.variant !== gameState_.variant
    ) {
        gameState.variant = gameState_.variant;

        const guessesState = store.getState().guesses;
        store.dispatch(updateStatistics(guessesState));
    }

    const appState = store.getState();

    window.localStorage.setItem(LOCALSTORAGE_KEY_DATE, today);
    window.localStorage.setItem(
        LOCALSTORAGE_KEY_STATE,
        JSON.stringify({
            ...appState,
            guesses: {
                ...appState.guesses,
                currentGuessLetterIndex: 0,
                guesses: makeTuple(GUESS_COUNT, (guessIndex) => {
                    const guess = appState.guesses.guesses[guessIndex];
                    if (guess.result?.variant === "Result::Ok") {
                        return guess;
                    } else {
                        return {
                            result: null,
                            value: makeTuple(GUESS_LETTER_COUNT, () => null),
                        };
                    }
                }),
            },
        }),
    );
});
