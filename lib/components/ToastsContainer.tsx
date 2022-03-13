import { useEffect, useState } from "react";

import { GUESS_COUNT } from "../../constants";
import {
    fetchAnswer,
    useAppDispatch,
    useCurrentGuessIndex,
    useGameState,
    useGuessResult,
} from "../store";

import { ToastItem } from "./ToastItem";

import styles from "./ToastsContainer.module.css";

import type { Attributes, ComponentProps } from "react";
import type * as error from "../error";
import type { GuessIndex } from "../guess";

type ToastItemProps = Omit<ComponentProps<typeof ToastItem>, "onClose"> &
    Attributes;

const formatGuessError = (guessError: error.guess.GuessError): string => {
    switch (guessError.variant) {
        case "WordError::MissingLetters":
            return "Not enough letters";
        case "WordError::NotInList":
            return "Not in word list";
    }
};

const generateRandomKey = (): string =>
    Array.from(crypto.getRandomValues(new Uint8Array(8)))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");

export const ToastsContainer = (): JSX.Element => {
    const currentGuessIndex = useCurrentGuessIndex();
    const currentGuessResult = useGuessResult(
        Math.min(currentGuessIndex, GUESS_COUNT - 1) as GuessIndex,
    );
    const dispatch = useAppDispatch();
    const gameState = useGameState();
    const [toasts, setToasts] = useState<ToastItemProps[]>([]);

    useEffect(() => {
        if (currentGuessResult === null) return;
        if (currentGuessResult.variant === "Result::Ok") return;

        crypto.getRandomValues(new Uint8Array(16));

        const toast: ToastItemProps = {
            children: <span>{formatGuessError(currentGuessResult.data)}</span>,
            key: generateRandomKey(),
            timeout: 1500,
        };

        setToasts((toasts) => [toast, ...toasts]);
    }, [currentGuessResult]);

    useEffect(() => {
        if (gameState.variant !== "GameState::Lost") return;

        const toast = new Promise<ToastItemProps>(async (resolve, reject) => {
            try {
                const action = await dispatch(fetchAnswer());
                const answer = action.payload as string;

                return resolve({
                    children: (
                        <span style={{ fontWeight: 700 }}>
                            {answer.toUpperCase()}
                        </span>
                    ),
                    key: generateRandomKey(),
                    timeout: Infinity,
                });
            } catch (err) {
                reject(err);
            }
        });

        const timeout = setTimeout(async () => {
            const toast_ = await toast;

            setToasts((toasts) => {
                if (toasts.some((toast) => toast.timeout === Infinity))
                    return toasts;

                return [toast_, ...toasts];
            });
        }, 1925);

        return () => clearTimeout(timeout);
    }, [gameState.variant]);

    return (
        <div className={styles["ToastsContainer"]}>
            {toasts.map((toast) => (
                <ToastItem
                    {...toast}
                    onClose={() =>
                        setToasts((modals) =>
                            modals.filter(({ key }) => key !== toast.key),
                        )
                    }
                />
            ))}
        </div>
    );
};
