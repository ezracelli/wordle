export const RESULT_VARIANT_OK = "Result::Ok";
export const RESULT_VARIANT_ERR = "Result::Err";

export interface Ok<T> {
    data: T;
    variant: typeof RESULT_VARIANT_OK;
}

export interface Err<E> {
    data: E;
    variant: typeof RESULT_VARIANT_ERR;
}

export type Result<T, E> = Ok<T> | Err<E>;

export const Result = Object.freeze({
    Ok: <T, E>(data: T): Result<T, E> => ({ data, variant: RESULT_VARIANT_OK }),
    Err: <T, E>(data: E): Result<T, E> => ({
        data,
        variant: RESULT_VARIANT_ERR,
    }),
});
