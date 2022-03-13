import { GUESS_LETTER_COUNT } from "../../constants";
import * as error from "../error";
import * as result from "../result";
import { makeTuple } from "../tuple";

import { words } from "./words";

import type { GuessLetterResult, GuessResult } from "../guess";

export const getGuessResult = (guess: string, answer: string): GuessResult => {
    if (guess.length < GUESS_LETTER_COUNT) {
        return result.Result.Err(error.guess.GuessError.MissingLetters());
    }

    if (!words.has(guess)) {
        return result.Result.Err(error.guess.GuessError.NotInList());
    }

    const letterResults = makeTuple(
        GUESS_LETTER_COUNT,
        (letterIndex): GuessLetterResult => {
            if (answer[letterIndex]! === guess[letterIndex]!) {
                return result.Result.Ok(undefined);
            } else if (answer.includes(guess[letterIndex]!)) {
                return result.Result.Err(
                    error.letter.LetterError.IncorrectPosition(),
                );
            } else {
                return result.Result.Err(error.letter.LetterError.NotInWord());
            }
        },
    );

    return result.Result.Ok(letterResults);
};
