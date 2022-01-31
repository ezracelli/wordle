import { getAnswerIndex, useParsedBody } from "~/lib/api";
import {
    GuessError,
    GuessLetterResult,
    GuessStatus,
    GUESS_LETTER_COUNT,
} from "~/lib/constants";

import ANSWERS from "../../data/answers.json";
import NONANSWERS from "../../data/nonanswers.json";

import type { Handler } from "vite-plugin-mix";

const WORDS = new Set([...ANSWERS, ...NONANSWERS]);

export const handler: Handler = async (req, res, next) => {
    if (req.path !== "/api/guess") return next();

    const body = await useParsedBody(req);
    if (body.status === "error") {
        res.statusCode = body.statusCode;
        return res.end();
    }

    const guess = body.data.get("guess");
    if (guess === null) {
        res.statusCode === 422;
        return res.end();
    }

    if (guess.length < GUESS_LETTER_COUNT) {
        res.statusCode = 200;
        return res.end(
            JSON.stringify({
                error: GuessError.NOT_ENOUGH_LETTERS,
                status: GuessStatus.ERROR,
            }),
        );
    }

    if (guess.length > GUESS_LETTER_COUNT) {
        res.statusCode = 200;
        return res.end(
            JSON.stringify({
                error: GuessError.TOO_MANY_LETTERS,
                status: GuessStatus.ERROR,
            }),
        );
    }

    if (!WORDS.has(guess)) {
        res.statusCode = 200;
        return res.end(
            JSON.stringify({
                error: GuessError.NOT_A_WORD,
                status: GuessStatus.ERROR,
            }),
        );
    }

    const answerIndex = getAnswerIndex(ANSWERS.length);
    const answer = ANSWERS[answerIndex]!;

    res.statusCode = 200;
    return res.end(
        JSON.stringify({
            data: guess.split("").map((letter, i) => {
                if (answer.indexOf(letter) === i)
                    return GuessLetterResult.CORRECT;
                if (answer.includes(letter))
                    return GuessLetterResult.INCORRECT_LOCATION;
                return GuessLetterResult.NOT_IN_WORD;
            }),
            status: GuessStatus.SUCCESS,
        }),
    );
};
