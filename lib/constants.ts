export const GUESS_COUNT = 6;
export const GUESS_LETTER_COUNT = 5;

export enum GuessAnimation {
    Wiggle,
}

export enum GuessError {
    NOT_A_WORD,
    NOT_ENOUGH_LETTERS,
    TOO_MANY_LETTERS,
}

export enum GuessLetterAnimation {
    Bounce,
    Flip,
}

export enum GuessLetterResult {
    CORRECT,
    INCORRECT_LOCATION,
    NOT_IN_WORD,
}

export enum GuessStatus {
    ERROR,
    SUCCESS,
}

export const QUERTY_KEYBOARD = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
];
