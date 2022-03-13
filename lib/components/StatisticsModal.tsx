import cx from "classnames";
import { useEffect, useMemo, useState } from "react";

import { FIRST_GAME_DATE, GUESS_COUNT } from "../../constants";
import {
    useCurrentGuessIndex,
    useGameState,
    useGuessResults,
    useStatisticsState,
} from "../store";

import styles from "./StatisticsModal.module.css";

import type { GUESS_LETTER_COUNT } from "../../constants";
import type { GuessLetterResult } from "../guess";
import type * as result from "../result";
import type { Tuple } from "../tuple";

const getSecondsUntilEndOfDay = () => {
    const now = new Date();

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();

    return 24 * 60 * 60 - hours * 60 * 60 - minutes * 60 - seconds;
};

export interface StatisticsModalProps {
    variant: "Modal::Statistics";
}

export const StatisticsModal = (_: StatisticsModalProps): JSX.Element => {
    const currentGuessIndex = useCurrentGuessIndex();
    const gameState = useGameState();
    const guessResults = useGuessResults();
    const [secondsUntilEndOfDay, setSecondsUntilEndOfDay] = useState(() =>
        getSecondsUntilEndOfDay(),
    );
    const statisticsState = useStatisticsState();

    const formattedShareText = useMemo(() => {
        if (gameState.variant === "GameState::InProgress") return "";

        const gameNumber = Math.ceil(
            (new Date().valueOf() - FIRST_GAME_DATE.valueOf()) /
                (1000 * 60 * 60 * 24),
        );

        const emoji = guessResults
            .filter(
                (
                    guessResult,
                ): guessResult is result.Ok<
                    Tuple<GuessLetterResult, typeof GUESS_LETTER_COUNT>
                > => guessResult?.variant === "Result::Ok",
            )
            .map((guessResult) =>
                guessResult.data
                    .map((guessLetterResult) => {
                        if (guessLetterResult.variant === "Result::Ok") {
                            return "🟩";
                        } else if (
                            guessLetterResult.data.variant ===
                            "LetterError::IncorrectPosition"
                        ) {
                            return "🟨";
                        } else {
                            return "⬛️";
                        }
                    })
                    .join(""),
            )
            .join("\n");

        return `Eggle ${gameNumber} ${
            gameState.variant === "GameState::Won" ? currentGuessIndex : "X"
        }/${GUESS_COUNT}\n\n${emoji}`;
    }, [gameState, guessResults]);

    const formattedTimeUntilEndOfDay = useMemo(() => {
        const hours = Math.floor(secondsUntilEndOfDay / (60 * 60));
        const minutes = Math.floor(
            (secondsUntilEndOfDay - hours * 60 * 60) / 60,
        );
        const seconds = secondsUntilEndOfDay - hours * 60 * 60 - minutes * 60;

        return `${hours.toString().padStart(2, "0")}:${minutes
            .toString()
            .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }, [secondsUntilEndOfDay]);

    const maxGameCountForAnyGuessIndex = useMemo(
        () => Math.max(...Object.values(statisticsState.guessesDistribution)),
        [statisticsState.guessesDistribution],
    );

    useEffect(() => {
        if (gameState.variant === "GameState::InProgress") return;

        const interval = setInterval(() => {
            setSecondsUntilEndOfDay(() => getSecondsUntilEndOfDay());
        }, 1000);

        return () => clearInterval(interval);
    }, [gameState]);

    return (
        <div>
            <h2 className={styles["StatisticsModal__section-title"]}>
                Statistics
            </h2>

            <div className={styles["StatisticsModal__statistics"]}>
                <div className={styles["StatisticsModal__statistic"]}>
                    <div className={styles["StatisticsModal__statistic-value"]}>
                        {statisticsState.gameCount}
                    </div>
                    <div className={styles["StatisticsModal__statistic-label"]}>
                        Played
                    </div>
                </div>
                <div className={styles["StatisticsModal__statistic"]}>
                    <div className={styles["StatisticsModal__statistic-value"]}>
                        {statisticsState.gameCount > 0
                            ? Math.round(
                                  (statisticsState.winCount /
                                      statisticsState.gameCount) *
                                      100,
                              )
                            : 0}
                    </div>
                    <div className={styles["StatisticsModal__statistic-label"]}>
                        Win %
                    </div>
                </div>
                <div className={styles["StatisticsModal__statistic"]}>
                    <div className={styles["StatisticsModal__statistic-value"]}>
                        {statisticsState.streakCount}
                    </div>
                    <div className={styles["StatisticsModal__statistic-label"]}>
                        Current Streak
                    </div>
                </div>
                <div className={styles["StatisticsModal__statistic"]}>
                    <div className={styles["StatisticsModal__statistic-value"]}>
                        {statisticsState.maxStreakCount}
                    </div>
                    <div className={styles["StatisticsModal__statistic-label"]}>
                        Max Streak
                    </div>
                </div>
            </div>

            <div>
                <h3 className={styles["StatisticsModal__section-title"]}>
                    Guess Distribution
                </h3>
                <div className={styles["StatisticsModal__distribution"]}>
                    {Object.entries(statisticsState.guessesDistribution).map(
                        ([guessIndex, gameCount]) => (
                            <div
                                className={
                                    styles["StatisticsModal__distribution-row"]
                                }
                                key={guessIndex}
                            >
                                <div
                                    className={
                                        styles[
                                            "StatisticsModal__distribution-row-label"
                                        ]
                                    }
                                >
                                    {+guessIndex + 1}
                                </div>
                                <div
                                    className={cx(
                                        styles[
                                            "StatisticsModal__distribution-row-value"
                                        ],
                                        gameState.variant ===
                                            "GameState::Won" &&
                                            +guessIndex + 1 ===
                                                currentGuessIndex &&
                                            styles[
                                                "StatisticsModal__distribution-row-value--winning"
                                            ],
                                    )}
                                    style={{
                                        width: `calc(${
                                            (gameCount /
                                                maxGameCountForAnyGuessIndex) *
                                            100
                                        }% - 1.25rem)`,
                                    }}
                                >
                                    {gameCount}
                                </div>
                            </div>
                        ),
                    )}
                </div>
            </div>

            {gameState.variant !== "GameState::InProgress" && (
                <div className={styles["StatisticsModal__bottom"]}>
                    <div>
                        <h3
                            className={cx(
                                styles["StatisticsModal__section-title"],
                                styles[
                                    "StatisticsModal__section-title--bottom"
                                ],
                            )}
                        >
                            Next Eggle
                        </h3>
                        <div className={styles["StatisticsModal__countdown"]}>
                            {formattedTimeUntilEndOfDay}
                        </div>
                    </div>
                    <div>
                        <button
                            className={styles["StatisticsModal__share-button"]}
                            onClick={async () => {
                                try {
                                    await window.navigator.share({
                                        text: formattedShareText,
                                    });
                                } catch {
                                    await window.navigator.clipboard.writeText(
                                        formattedShareText,
                                    );
                                }
                            }}
                        >
                            <span>Share</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24"
                                viewBox="0 0 24 24"
                                width="24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92c0-1.61-1.31-2.92-2.92-2.92zM18 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM6 13c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm12 7.02c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
