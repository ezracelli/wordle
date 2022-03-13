import answers from "../../data/answers.json";
import nonanswers from "../../data/nonanswers.json";

export const words = new Set([...answers, ...nonanswers]);
