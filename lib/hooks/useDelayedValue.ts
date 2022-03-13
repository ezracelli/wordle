import { useEffect, useState } from "react";

export const useDelayedValue = <T>(value: T, delay: number): T => {
    const [value_, setValue_] = useState(value);

    useEffect(() => {
        const value_ = value;
        const timeout = setTimeout(() => setValue_(value_), delay);
        return () => clearTimeout(timeout);
    }, [delay, value]);

    return value_;
};
