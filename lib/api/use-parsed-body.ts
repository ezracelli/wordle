import { useBody } from ".";

import type { IncomingMessage } from "node:http";

export const useParsedBody = async (
    req: IncomingMessage,
): Promise<
    | {
          data: URLSearchParams;
          status: "success";
      }
    | {
          status: "error";
          statusCode: number;
      }
> => {
    const contentType = req.headers["content-type"]?.split(";")[0];

    const body = await useBody(req);
    if (body.status === "error") return body;

    let text: string;
    try {
        text = new TextDecoder().decode(body.data);
    } catch {
        return { status: "error", statusCode: 400 };
    }

    switch (contentType) {
        case "application/x-www-form-urlencoded": {
            try {
                const data = new URLSearchParams(text);
                return { data, status: "success" };
            } catch {
                return { status: "error", statusCode: 400 };
            }
        }
        default: {
            return { status: "error", statusCode: 415 };
        }
    }
};
