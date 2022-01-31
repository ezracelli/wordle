import { getAnswerIndex, useParsedBody } from "../lib/api";
import {
    GuessError,
    GuessLetterResult,
    GuessStatus,
    GUESS_LETTER_COUNT,
} from "../lib/constants";

import ANSWERS from "../data/answers.json";
import NONANSWERS from "../data/nonanswers.json";

import type { IncomingMessage, ServerResponse } from "node:http";

const WORDS = new Set([...ANSWERS, ...NONANSWERS]);

export default async (
    req: IncomingMessage,
    res: ServerResponse,
    next: (err?: unknown) => void,
): Promise<void> => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname !== "/api/guess") return next();

    const body = await useParsedBody(req);
    if (body.status === "error") {
        res.statusCode = body.statusCode;
        return void res.end();
    }

    const guess = body.data.get("guess");
    if (guess === null) {
        res.statusCode === 422;
        return void res.end();
    }

    if (guess.length < GUESS_LETTER_COUNT) {
        res.statusCode = 200;
        return void res.end(
            JSON.stringify({
                error: GuessError.NOT_ENOUGH_LETTERS,
                status: GuessStatus.ERROR,
            }),
        );
    }

    if (guess.length > GUESS_LETTER_COUNT) {
        res.statusCode = 200;
        return void res.end(
            JSON.stringify({
                error: GuessError.TOO_MANY_LETTERS,
                status: GuessStatus.ERROR,
            }),
        );
    }

    if (!WORDS.has(guess)) {
        res.statusCode = 200;
        return void res.end(
            JSON.stringify({
                error: GuessError.NOT_A_WORD,
                status: GuessStatus.ERROR,
            }),
        );
    }

    const answerIndex = getAnswerIndex(ANSWERS.length);
    const answer = ANSWERS[answerIndex]!;

    res.statusCode = 200;
    return void res.end(
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
