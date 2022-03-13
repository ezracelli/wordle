import cx from "classnames";
import { useEffect, useRef, useState } from "react";

import styles from "./ToastItem.module.css";

import type { PropsWithChildren } from "react";

export interface ToastItemProps {
    onClose: () => void;
    timeout?: number | undefined;
}

export const ToastItem = ({
    children,
    onClose,
    timeout = 2500,
}: PropsWithChildren<ToastItemProps>): JSX.Element => {
    const [isHidden, setIsHidden] = useState(true);

    const onClose_ = useRef(onClose);
    const timeout_ = useRef(timeout);

    useEffect(() => {
        onClose_.current = onClose;
    }, [onClose]);

    useEffect(() => {
        setTimeout(() => setIsHidden(false));

        if (timeout_.current === Infinity) return;

        const timeout = setTimeout(
            () => setIsHidden(true),
            timeout_.current - 150,
        );

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        if (timeout_.current === Infinity) return;

        const timeout = setTimeout(
            () => onClose_.current?.(),
            timeout_.current,
        );

        return () => clearTimeout(timeout);
    }, []);

    return (
        <div
            className={cx(
                styles["ToastItem"],
                isHidden && styles["ToastItem--hide"],
            )}
        >
            {children}
        </div>
    );
};
