import "./app.css";

import cx from "classnames";
import {
    useCallback,
    useEffect,
    useLayoutEffect,
    useRef,
    useState,
} from "preact/hooks";

import {
    GuessAnimation,
    GuessError,
    GuessLetterAnimation,
    GuessLetterResult,
    GuessStatus,
    GUESS_COUNT,
    GUESS_LETTER_COUNT,
    QUERTY_KEYBOARD,
} from "~/lib/constants";
import { useQuery } from "~/lib/hooks";
import * as actions from "~/lib/store/actions";
import { useAppDispatch, useAppSelector } from "~/lib/store/hooks";
import { makeTuple } from "~/lib/util";

import type { JSX } from "preact";
import type { Tuple } from "~/lib/types";

enum GameState {
    Incomplete,
    Lost,
    Won,
}

type GuessResult =
    | {
          data: Tuple<GuessLetterResult, typeof GUESS_LETTER_COUNT>;
          status: GuessStatus.SUCCESS;
      }
    | {
          error: GuessError;
          status: GuessStatus.ERROR;
      };

const formatAsEmoji = (
    guessesLettersResults: Tuple<
        Tuple<GuessLetterResult | null, typeof GUESS_LETTER_COUNT>,
        typeof GUESS_COUNT
    >,
): string =>
    guessesLettersResults
        .map((guessResult) =>
            guessResult
                .map((guessLetterResult) => {
                    switch (guessLetterResult) {
                        case GuessLetterResult.CORRECT:
                            return "🟩";
                        case GuessLetterResult.INCORRECT_LOCATION:
                            return "🟨";
                        case GuessLetterResult.NOT_IN_WORD:
                            return "⬛️";
                        default:
                            return "";
                    }
                })
                .join(""),
        )
        .filter(Boolean)
        .join("\n");

export const App = (): JSX.Element => {
    const dispatch = useAppDispatch();
    const { currentGuessIndex, currentGuessLetterIndex, guesses } =
        useAppSelector((state) => state);

    const usedLetters = new Set(
        guesses
            .slice(0, currentGuessIndex)
            .map((guess) => guess.letters.map((letter) => letter.value))
            .flat()
            .filter((letter): letter is string => letter !== null),
    );

    const isMaxGuesses = currentGuessIndex === GUESS_COUNT;
    const isMaxGuessLetters = currentGuessLetterIndex === GUESS_LETTER_COUNT;

    const currentGuessFullWord =
        guesses[Math.min(currentGuessIndex, GUESS_COUNT - 1)]?.letters
            .map((letter) => letter.value)
            .filter((value) => value !== null)
            .join("") ?? "";

    const guessRefs = useRef(
        makeTuple(GUESS_COUNT, (): HTMLDivElement | null => null),
    );

    const guessLetterRefs = useRef(
        makeTuple(GUESS_COUNT, () =>
            makeTuple(GUESS_LETTER_COUNT, (): HTMLDivElement | null => null),
        ),
    );

    useLayoutEffect(() => {
        const guessAnimationEndHandlers = makeTuple(
            GUESS_COUNT,
            (guessIndex) =>
                [
                    guessIndex,
                    () =>
                        void dispatch(
                            actions.setGuessAnimation(null, guessIndex),
                        ),
                ] as const,
        );

        const guessLetterAnimationEndHandlers = makeTuple(
            GUESS_COUNT,
            (guessIndex) =>
                makeTuple(
                    GUESS_LETTER_COUNT,
                    (guessLetterIndex) =>
                        [
                            guessIndex,
                            guessLetterIndex,
                            () =>
                                void dispatch(
                                    actions.setGuessLetterAnimation(
                                        null,
                                        guessIndex,
                                        guessLetterIndex,
                                    ),
                                ),
                        ] as const,
                ),
        );

        guessAnimationEndHandlers.forEach(
            ([guessIndex, handleAnimationEnd]) => {
                guessRefs.current[guessIndex]?.addEventListener(
                    "animationend",
                    handleAnimationEnd,
                );
            },
        );

        guessLetterAnimationEndHandlers.forEach(
            (guessLettersAnimationEndHandlers) => {
                guessLettersAnimationEndHandlers.forEach(
                    ([guessIndex, guessLetterIndex, handleAnimationEnd]) => {
                        guessLetterRefs.current[guessIndex][
                            guessLetterIndex
                        ]?.addEventListener("animationend", handleAnimationEnd);
                    },
                );
            },
        );

        return () => {
            guessAnimationEndHandlers.forEach(
                ([guessIndex, handleAnimationEnd]) => {
                    guessRefs.current[guessIndex]?.removeEventListener(
                        "animationend",
                        handleAnimationEnd,
                    );
                },
            );

            guessLetterAnimationEndHandlers.forEach(
                (guessLettersAnimationEndHandlers) => {
                    guessLettersAnimationEndHandlers.forEach(
                        ([
                            guessIndex,
                            guessLetterIndex,
                            handleAnimationEnd,
                        ]) => {
                            guessLetterRefs.current[guessIndex][
                                guessLetterIndex
                            ]?.removeEventListener(
                                "animationend",
                                handleAnimationEnd,
                            );
                        },
                    );
                },
            );
        };
    }, []);

    const gameState = guesses[
        Math.min(currentGuessIndex, GUESS_COUNT - 1)
    ]?.letters.every((letter) => letter.result === GuessLetterResult.CORRECT)
        ? GameState.Won
        : guesses.every((guess) =>
              guess.letters.every((letter) => letter.result !== null),
          )
        ? GameState.Lost
        : GameState.Incomplete;

    useEffect(() => {
        if (gameState !== GameState.Incomplete) {
            console.log(
                formatAsEmoji(
                    makeTuple(GUESS_COUNT, (guessIndex) =>
                        makeTuple(
                            GUESS_LETTER_COUNT,
                            (guessLetterIndex) =>
                                guesses[guessIndex].letters[guessLetterIndex]
                                    .result,
                        ),
                    ),
                ),
            );
        }
    }, [gameState]);

    const [shouldGetCurrentGuessResult, setShouldGetCurrentGuessResult] =
        useState(false);
    const currentGuessResultQuery = useQuery(
        ["/api/guess", currentGuessFullWord],
        async (): Promise<GuessResult> => {
            const response = await fetch("/api/guess", {
                body: new URLSearchParams({ guess: currentGuessFullWord }),
                method: "POST",
            });

            return await response.json();
        },
        {
            enabled:
                !isMaxGuesses &&
                isMaxGuessLetters &&
                shouldGetCurrentGuessResult,
            onSuccess: (guessResult) => {
                if (guessResult.status === GuessStatus.SUCCESS) {
                    makeTuple(GUESS_LETTER_COUNT, (guessLetterIndex) => {
                        setTimeout(() => {
                            dispatch(
                                actions.setGuessLetterAnimation(
                                    GuessLetterAnimation.Flip,
                                    currentGuessIndex,
                                    guessLetterIndex,
                                ),
                            );
                        }, 500 * guessLetterIndex);

                        setTimeout(() => {
                            dispatch(
                                actions.setGuessLetterResult(
                                    guessResult.data[guessLetterIndex],
                                    currentGuessIndex,
                                    guessLetterIndex,
                                ),
                            );
                        }, 500 * guessLetterIndex + 250);
                    });

                    const didWin = guessResult.data.every(
                        (guessLetterResult) =>
                            guessLetterResult === GuessLetterResult.CORRECT,
                    );

                    if (!didWin) {
                        setTimeout(() => {
                            dispatch(actions.incrementCurrentGuessIndex());
                            dispatch(actions.setCurrentGuessLetterIndex(0));

                            setShouldGetCurrentGuessResult(false);
                        }, 500 * GUESS_COUNT);
                    }
                } else {
                    dispatch(actions.setGuessAnimation(GuessAnimation.Wiggle));
                    setShouldGetCurrentGuessResult(false);
                    // TODO: show modal with error
                }
            },
        },
    );

    const tryPushLetterToCurrentGuess = useCallback(
        (guessLetterValue: string) => {
            if (currentGuessResultQuery.status !== "idle") return;

            dispatch(actions.setGuessLetterValue(guessLetterValue));
            dispatch(
                actions.setGuessLetterAnimation(GuessLetterAnimation.Bounce),
            );
            dispatch(actions.incrementCurrentGuessLetterIndex());
        },
        [currentGuessResultQuery.status],
    );

    const tryPopLetterFromCurrentGuess = useCallback(() => {
        if (currentGuessResultQuery.status !== "idle") return;

        dispatch(actions.decrementCurrentGuessLetterIndex());
        dispatch(actions.setGuessLetterValue(null));
    }, [currentGuessResultQuery.status]);

    const tryPushGuess = useCallback(() => {
        if (currentGuessResultQuery.status !== "idle") return;

        if (!isMaxGuessLetters) {
            dispatch(actions.setGuessAnimation(GuessAnimation.Wiggle));
            return;
        }

        setShouldGetCurrentGuessResult(true);
    }, [currentGuessResultQuery.status, isMaxGuessLetters]);

    useLayoutEffect(() => {
        const handleKeyup = (e: KeyboardEvent) => {
            if (/^[a-z]$/.test(e.key)) {
                tryPushLetterToCurrentGuess(e.key);
            } else if (e.key === "Enter") {
                tryPushGuess();
            } else if (e.key === "Backspace") {
                tryPopLetterFromCurrentGuess();
            }
        };

        window.addEventListener("keyup", handleKeyup);
        return () => window.removeEventListener("keyup", handleKeyup);
    }, [
        tryPopLetterFromCurrentGuess,
        tryPushLetterToCurrentGuess,
        tryPushGuess,
    ]);

    return (
        <>
            <header class="header">
                <h1 class="header__title">WORDLE</h1>
            </header>
            <div class="guesses">
                {makeTuple(GUESS_COUNT, (guessIndex) => (
                    <div
                        class={cx("guesses__guess guess", {
                            "guess--animation--wiggle":
                                guesses[guessIndex].animation ===
                                GuessAnimation.Wiggle,
                        })}
                        ref={(element) => {
                            guessRefs.current[guessIndex] = element;
                        }}
                    >
                        {makeTuple(GUESS_LETTER_COUNT, (guessLetterIndex) => (
                            <div
                                class={cx("guess__letter letter", {
                                    "letter--animation--bounce":
                                        guesses[guessIndex].letters[
                                            guessLetterIndex
                                        ].animation ===
                                        GuessLetterAnimation.Bounce,
                                    "letter--animation--flip":
                                        guesses[guessIndex].letters[
                                            guessLetterIndex
                                        ].animation ===
                                        GuessLetterAnimation.Flip,
                                    "letter--correct":
                                        guesses[guessIndex].letters[
                                            guessLetterIndex
                                        ].result === GuessLetterResult.CORRECT,
                                    "letter--incorrect":
                                        guesses[guessIndex].letters[
                                            guessLetterIndex
                                        ].result ===
                                        GuessLetterResult.NOT_IN_WORD,
                                    "letter--incorrect-location":
                                        guesses[guessIndex].letters[
                                            guessLetterIndex
                                        ].result ===
                                        GuessLetterResult.INCORRECT_LOCATION,
                                })}
                                key={`${guessIndex}.${guessLetterIndex}`}
                                ref={(element) => {
                                    guessLetterRefs.current[guessIndex][
                                        guessLetterIndex
                                    ] = element;
                                }}
                            >
                                {
                                    guesses[guessIndex].letters[
                                        guessLetterIndex
                                    ].value
                                }
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div class="keyboard">
                {QUERTY_KEYBOARD.map((row, rowIndex) => (
                    <div class="keyboard__row" key={rowIndex}>
                        {rowIndex === 2 && (
                            <button
                                class="keyboard__letter keyboard__letter--enter"
                                onClick={() => tryPushGuess()}
                            >
                                Enter
                            </button>
                        )}
                        {row.map((letter, letterIndex) => (
                            <button
                                class={cx("keyboard__letter", {
                                    "keyboard__letter--used":
                                        usedLetters.has(letter),
                                })}
                                key={letterIndex}
                                onClick={() =>
                                    tryPushLetterToCurrentGuess(letter)
                                }
                            >
                                {letter}
                            </button>
                        ))}
                        {rowIndex === 2 && (
                            <button
                                aria-label="Backspace"
                                class="keyboard__letter keyboard__letter--backspace"
                                onClick={() => tryPopLetterFromCurrentGuess()}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    width="24"
                                >
                                    <path
                                        fill="currentColor"
                                        d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H7.07L2.4 12l4.66-7H22v14zm-11.59-2L14 13.41 17.59 17 19 15.59 15.41 12 19 8.41 17.59 7 14 10.59 10.41 7 9 8.41 12.59 12 9 15.59z"
                                    ></path>
                                </svg>
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </>
    );
};
