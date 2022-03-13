import cx from "classnames";
import { useEffect, useState } from "react";

import { useDelayedValue } from "../hooks";
import { useGuessLetter, useGuessLetterResult } from "../store";

import styles from "./GuessLetter.module.css";

import type * as error from "../error";
import type { GuessIndex, GuessLetterIndex } from "../guess";
import type * as result from "../result";

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

export interface GuessLetterProps {
    guessIndex: GuessIndex;
    guessLetterIndex: GuessLetterIndex;
}

export const GuessLetter = ({
    guessIndex,
    guessLetterIndex,
}: GuessLetterProps): JSX.Element => {
    const [animation, setAnimation] = useState<string | null>(null);
    const guessLetter = useGuessLetter(guessIndex, guessLetterIndex);
    const guessLetterResult = useGuessLetterResult(
        guessIndex,
        guessLetterIndex,
    );

    const guessLetterResultDelayed350 = useDelayedValue(
        guessLetterResult,
        350 * guessLetterIndex,
    );
    const guessLetterResultDelayed525 = useDelayedValue(
        guessLetterResult,
        350 * guessLetterIndex + 175,
    );

    useEffect(() => {
        if (guessLetter === null) return;

        setAnimation("pulse");
        const timeout = setTimeout(() => setAnimation(null), 150);

        return () => clearTimeout(timeout);
    }, [guessLetter]);

    useEffect(() => {
        const guessLetterResult = guessLetterResultDelayed350;

        if (guessLetterResult === null) return;

        setAnimation("flip");
        const timeout = setTimeout(() => setAnimation(null), 350);

        return () => clearTimeout(timeout);
    }, [guessLetterIndex, guessLetterResultDelayed350]);

    return (
        <div
            className={cx(
                styles["GuessLetter"],
                animation && styles[`GuessLetter--animation-${animation}`],
                guessLetterResultDelayed525 &&
                    styles[
                        `GuessLetter--${formatResultVariantAsClassNameModifier(
                            guessLetterResultDelayed525.variant,
                        )}`
                    ],
                guessLetterResultDelayed525?.variant === "Result::Err" &&
                    styles[
                        `GuessLetter--${formatGuessLetterResultVariantAsClassNameModifier(
                            guessLetterResultDelayed525.data.variant,
                        )}`
                    ],
            )}
        >
            {guessLetter}
        </div>
    );
};
