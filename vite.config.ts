import * as path from "node:path";

import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

import type { NextHandleFunction } from "connect";
import type { Plugin, ResolvedConfig } from "vite";

export default defineConfig({
    clearScreen: false,
    plugins: [
        preact(),
        (({ handlerFilePath }: { handlerFilePath: string }): Plugin => {
            let viteResolvedConfig: ResolvedConfig;

            return {
                name: "vite-plugin-api-routes",

                configResolved: (config) => {
                    viteResolvedConfig = config;
                },

                configureServer: async (viteDevServer) => {
                    const { default: connect } = await import("connect");

                    viteDevServer.middlewares.use(async (req, res, next) => {
                        const app = connect();

                        try {
                            const handlerFilePathResolved = path.resolve(
                                viteResolvedConfig.root,
                                handlerFilePath,
                            );

                            const { handler } =
                                (await viteDevServer.ssrLoadModule(
                                    `/@fs/${handlerFilePathResolved}`,
                                )) as {
                                    handler: NextHandleFunction;
                                };

                            app.use((req, res, next) => {
                                handler(req, res, next);
                            });

                            app(req, res, next);
                        } catch (err) {
                            viteDevServer.ssrFixStacktrace(err as Error);
                            next(err);
                        }
                    });
                },
            };
        })({ handlerFilePath: "src/api/guess.ts" }),
    ],
    resolve: {
        alias: {
            "~": __dirname,
        },
    },
});
