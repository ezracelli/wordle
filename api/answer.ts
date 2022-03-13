import { GUESS_COUNT } from "../constants";
import { isValidTimeZone, getAnswer, getGuessResult } from "../lib/api";
import { makeTuple } from "../lib/tuple";

import type { VercelApiHandler } from "@vercel/node";

const handler: VercelApiHandler = (req, res) => {
    if (req.method !== "GET") {
        res.status(405).end();
        return;
    }

    const { guesses, tz = "America/New_York" } = req.query;

    if (
        typeof tz !== "string" ||
        !isValidTimeZone(tz) ||
        typeof guesses !== "string"
    ) {
        res.status(400).end();
        return;
    }

    try {
        const guesses_ = JSON.parse(guesses);
        if (!Array.isArray(guesses_) || guesses_.length !== GUESS_COUNT) {
            res.status(400).end();
            return;
        }

        for (const guess of guesses_) {
            if (typeof guess !== "string") {
                res.status(400).end();
                return;
            }
        }

        const answer = getAnswer(tz);
        const guessResults = makeTuple(GUESS_COUNT, (guessIndex) =>
            getGuessResult(guesses_[guessIndex], answer),
        );

        if (
            guessResults.some(
                (guessResult) =>
                    guessResult.variant !== "Result::Ok" ||
                    guessResult.data.some(
                        (guessLetterResult) =>
                            guessLetterResult.variant === "Result::Ok",
                    ),
            )
        ) {
            res.status(400).end();
            return;
        }

        res.send(answer);
        return;
    } catch {
        res.status(400).end();
        return;
    }
};

export default handler;
