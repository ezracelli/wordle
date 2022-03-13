import { useEffect, useRef } from "react";

import { StatisticsModal } from "./StatisticsModal";

import styles from "./ModalsContainer.module.css";

import type { StatisticsModalProps } from "./StatisticsModal";

export interface ModalsContainerProps {
    onClose: () => void;
    variant: StatisticsModalProps["variant"] | null;
}

export const ModalsContainer = ({
    onClose,
    variant,
}: ModalsContainerProps): JSX.Element => {
    const backdropRef = useRef<HTMLDivElement>(null);
    const onClose_ = useRef(onClose);

    const modalMarkup = (() => {
        switch (variant) {
            case "Modal::Statistics":
                return <StatisticsModal variant={variant} />;
            default:
                return null;
        }
    })();

    useEffect(() => {
        onClose_.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (variant === null) return;

        const handleClick = (e: MouseEvent) => {
            if (e.target === backdropRef.current) {
                onClose_.current();
            }
        };

        window.addEventListener("click", handleClick);
        return () => window.removeEventListener("click", handleClick);
    }, [variant]);

    return (
        <div className={styles["ModalsContainer"]}>
            {modalMarkup && (
                <>
                    <div
                        className={styles["ModalsContainer__backdrop"]}
                        ref={backdropRef}
                    />
                    <div className={styles["ModalsContainer__modal"]}>
                        {modalMarkup}
                    </div>
                </>
            )}
        </div>
    );
};
