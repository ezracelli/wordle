import { createStore } from "redux";

import { reducer } from "./reducer";

export const store = createStore(
    reducer,
    import.meta.env.DEV
        ? (await import("@redux-devtools/extension")).composeWithDevTools({
              trace: true,
          })()
        : undefined,
);

export * from "./types";
