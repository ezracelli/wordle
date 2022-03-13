import MersenneTwister from "mersenne-twister";

import answers from "../../data/answers.json";

const getSeed = (tz: string) => [
    ...new TextEncoder().encode(
        new Intl.DateTimeFormat("en-US", {
            dateStyle: "long",
            timeZone: tz,
        }).format(new Date()),
    ),
];

const getAnswerIndex = (tz: string) => {
    const mt = new MersenneTwister(getSeed(tz));
    return Math.floor(mt.random() * answers.length - 1);
};

export const getAnswer = (tz: string) => answers[getAnswerIndex(tz)]!;
