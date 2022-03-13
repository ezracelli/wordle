import { useEffect, useRef, useState } from "react";

import { GUESS_COUNT } from "./constants";
import { Guess } from "./lib/components/Guess";
import { Keyboard } from "./lib/components/Keyboard";
import { ModalsContainer } from "./lib/components/ModalsContainer";
import { ToastsContainer } from "./lib/components/ToastsContainer";
import { useDelayedValue } from "./lib/hooks";
import {
    fetchResultForCurrentGuess,
    useAppDispatch,
    popLetterFromCurrentGuess,
    pushLetterToCurrentGuess,
    useGameState,
} from "./lib/store";
import { makeTuple } from "./lib/tuple";

import styles from "./App.module.css";

import type { ModalsContainerProps } from "./lib/components/ModalsContainer";
import type { GuessResult } from "./lib/guess";

export const App = (): JSX.Element => {
    const [currentModalVariant, setCurrentModalVariant] =
        useState<ModalsContainerProps["variant"]>(null);
    const dispatch = useAppDispatch();
    const isGuessing = useRef(false);
    const gameState = useGameState();

    const gameStateDelayed1925 = useDelayedValue(gameState, 1925);

    const guessesMarkup = makeTuple(GUESS_COUNT, (guessIndex) => (
        <Guess guessIndex={guessIndex} key={guessIndex} />
    ));

    useEffect(() => {
        if (gameStateDelayed1925.variant === "GameState::InProgress") return;

        setCurrentModalVariant("Modal::Statistics");
    }, [gameStateDelayed1925]);

    useEffect(() => {
        if (gameState.variant !== "GameState::InProgress") return;

        const handleKeyup = async (e: KeyboardEvent) => {
            if (isGuessing.current) return;

            if (/^[a-z]$/.test(e.key)) {
                dispatch(pushLetterToCurrentGuess(e.key));
            } else if (e.key === "Backspace") {
                dispatch(popLetterFromCurrentGuess());
            } else if (e.key === "Enter") {
                isGuessing.current = true;

                const action = await dispatch(fetchResultForCurrentGuess());
                const guessResult = action.payload as GuessResult;

                setTimeout(
                    () => void (isGuessing.current = false),
                    guessResult.variant === "Result::Ok" ? 1925 : 600,
                );
            }
        };

        window.addEventListener("keyup", handleKeyup);
        return () => window.removeEventListener("keyup", handleKeyup);
    }, [dispatch, gameState.variant]);

    return (
        <>
            <header className={styles["App__header"]}>
                <h1 className={styles["App__h1"]}>EGGLE</h1>
                <button
                    aris-label="Statistics"
                    className={styles["App__statistics-trigger"]}
                    onClick={() => setCurrentModalVariant("Modal::Statistics")}
                    type="button"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        height="24"
                        viewBox="0 0 24 24"
                        width="24"
                    >
                        <path
                            fill="currentColor"
                            d="M16,11V3H8v6H2v12h20V11H16z M10,5h4v14h-4V5z M4,11h4v8H4V11z M20,19h-4v-6h4V19z"
                        ></path>
                    </svg>
                </button>
            </header>
            <div className={styles["App__guesses"]}>{guessesMarkup}</div>
            <Keyboard />
            <ModalsContainer
                onClose={() => setCurrentModalVariant(null)}
                variant={currentModalVariant}
            />
            <ToastsContainer />
        </>
    );
};
