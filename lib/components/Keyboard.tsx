import cx from "classnames";

import { useDelayedValue } from "../hooks";
import { useLetterResults } from "../store";

import styles from "./Keyboard.module.css";

import type * as error from "../error";
import type * as result from "../result";

const KEYBOARD_ROWS = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["Enter", "z", "x", "c", "v", "b", "n", "m", "Backspace"],
];

const formatResultVariantAsClassNameModifier = (
    variant: result.Result<void, void>["variant"],
): string => {
    switch (variant) {
        case "Result::Ok":
            return "result-ok";
        case "Result::Err":
            return "result-err";
    }
};

const formatGuessLetterResultVariantAsClassNameModifier = (
    variant: error.letter.LetterError["variant"],
): string => {
    switch (variant) {
        case "LetterError::IncorrectPosition":
            return "error-incorrect-position";
        case "LetterError::NotInWord":
            return "error-not-in-word";
    }
};

const handleClick = (key: string) => {
    window.dispatchEvent(new KeyboardEvent("keyup", { key }));
};

export const Keyboard = (): JSX.Element => {
    const letterResults = useLetterResults();

    const letterResultsDelayed1925 = useDelayedValue(letterResults, 1925);

    return (
        <div className={styles["Keyboard"]}>
            {KEYBOARD_ROWS.map((KEYBOARD_ROW, i) => (
                <div className={styles["Keyboard__row"]} key={i}>
                    {KEYBOARD_ROW.map((KEY, j) => {
                        const letterResult = letterResultsDelayed1925.get(KEY);

                        return (
                            <button
                                className={cx(
                                    styles["Keyboard__letter"],
                                    styles[
                                        `Keyboard__letter--${KEY.toLowerCase()}`
                                    ],
                                    letterResult &&
                                        styles[
                                            `Keyboard__letter--${formatResultVariantAsClassNameModifier(
                                                letterResult.variant,
                                            )}`
                                        ],
                                    letterResult?.variant === "Result::Err" &&
                                        styles[
                                            `Keyboard__letter--${formatGuessLetterResultVariantAsClassNameModifier(
                                                letterResult.data.variant,
                                            )}`
                                        ],
                                )}
                                key={j}
                                onClick={() => handleClick(KEY)}
                                type="button"
                            >
                                {KEY === "Backspace" ? (
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
                                ) : (
                                    KEY
                                )}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
};
