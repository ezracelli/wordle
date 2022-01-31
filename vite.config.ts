import { defineConfig } from "vite";
import mix, { vercelAdapter } from "vite-plugin-mix";
import preact from "@preact/preset-vite";

export default defineConfig({
    clearScreen: false,
    plugins: [
        preact(),
        mix({ adapter: vercelAdapter(), handler: "src/api/handler.ts" }),
    ],
    resolve: {
        alias: {
            "~": __dirname,
        },
    },
});
