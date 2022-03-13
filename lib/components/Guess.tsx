import cx from "classnames";
import { useEffect, useState } from "react";

import { GUESS_LETTER_COUNT } from "../../constants";
import { useGuessResult } from "../store";
import { makeTuple } from "../tuple";

import { GuessLetter } from "./GuessLetter";

import styles from "./Guess.module.css";

import type { GuessIndex } from "../guess";

export interface GuessProps {
    guessIndex: GuessIndex;
}

export const Guess = ({ guessIndex }: GuessProps): JSX.Element => {
    const [animation, setAnimation] = useState<string | null>(null);
    const guessResult = useGuessResult(guessIndex);

    useEffect(() => {
        if (guessResult === null) return;
        if (guessResult.variant !== "Result::Err") return;

        setAnimation("wiggle");
        const timeout = setTimeout(() => setAnimation(null), 600);

        return () => clearTimeout(timeout);
    }, [guessResult]);

    const guessLettersMarkup = makeTuple(
        GUESS_LETTER_COUNT,
        (guessLetterIndex) => (
            <GuessLetter
                guessIndex={guessIndex}
                guessLetterIndex={guessLetterIndex}
                key={guessLetterIndex}
            />
        ),
    );

    return (
        <div
            className={cx(
                styles["Guess"],
                animation && styles[`Guess--animation-${animation}`],
            )}
        >
            {guessLettersMarkup}
        </div>
    );
};
