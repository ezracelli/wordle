export const isValidTimeZone = (tz: string) => {
    try {
        new Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    } catch {
        return false;
    }
};
