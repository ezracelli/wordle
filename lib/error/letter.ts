export const LETTER_ERROR_VARIANT_INCORRECT_POSITION =
    "LetterError::IncorrectPosition";
export const LETTER_ERROR_VARIANT_NOT_IN_WORD = "LetterError::NotInWord";

export interface IncorrectPosition {
    variant: typeof LETTER_ERROR_VARIANT_INCORRECT_POSITION;
}

export interface NotInWord {
    variant: typeof LETTER_ERROR_VARIANT_NOT_IN_WORD;
}

export type LetterError = IncorrectPosition | NotInWord;

export const LetterError = Object.freeze({
    IncorrectPosition: (): LetterError => ({
        variant: LETTER_ERROR_VARIANT_INCORRECT_POSITION,
    }),
    NotInWord: (): LetterError => ({
        variant: LETTER_ERROR_VARIANT_NOT_IN_WORD,
    }),
});
