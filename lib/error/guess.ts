export const GUESS_ERROR_VARIANT_MISSING_LETTERS = "WordError::MissingLetters";
export const GUESS_ERROR_VARIANT_NOT_IN_LIST = "WordError::NotInList";

export interface MissingLetters {
    variant: typeof GUESS_ERROR_VARIANT_MISSING_LETTERS;
}

export interface NotInList {
    variant: typeof GUESS_ERROR_VARIANT_NOT_IN_LIST;
}

export type GuessError = MissingLetters | NotInList;

export const GuessError = Object.freeze({
    MissingLetters: (): GuessError => ({
        variant: GUESS_ERROR_VARIANT_MISSING_LETTERS,
    }),
    NotInList: (): GuessError => ({ variant: GUESS_ERROR_VARIANT_NOT_IN_LIST }),
});
