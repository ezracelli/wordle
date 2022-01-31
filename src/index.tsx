import { render } from "preact";

import { store } from "~/lib/store";
import { ReduxProvider } from "~/lib/store/redux";

import { App } from "./app";

render(
    <ReduxProvider store={store}>
        <App />
    </ReduxProvider>,
    document.getElementById("app")!,
);
