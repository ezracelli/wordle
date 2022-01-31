import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

const mt19937 = require("@stdlib/random-base-mt19937");

const getSeed = (now: Date) =>
    Number(
        `${now.getUTCFullYear()}${now
            .getUTCMonth()
            .toString()
            .padStart(2, "0")}${now.getUTCDate().toString().padStart(2, "0")}`,
    );

export const getAnswerIndex = (answersCount: number) => {
    const rng = mt19937.factory({ seed: getSeed(new Date()) });
    return rng() % answersCount;
};
