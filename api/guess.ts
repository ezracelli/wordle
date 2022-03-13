import { isValidTimeZone, getAnswer, getGuessResult } from "../lib/api";

import type { VercelApiHandler } from "@vercel/node";

const handler: VercelApiHandler = (req, res) => {
    if (req.method !== "POST") {
        res.status(405).end();
        return;
    }

    const { guess, tz = "America/New_York" } = req.body;

    if (
        typeof tz !== "string" ||
        !isValidTimeZone(tz) ||
        typeof guess !== "string"
    ) {
        res.status(400).end();
        return;
    }

    const answer = getAnswer(tz);
    console.log({ answer });

    res.send(getGuessResult(guess, answer));
    return;
};

export default handler;
