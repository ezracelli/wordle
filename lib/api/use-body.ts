import type { IncomingMessage } from "node:http";

export const useBody = async (
    req: IncomingMessage,
): Promise<
    | {
          data: Uint8Array;
          status: "success";
      }
    | {
          status: "error";
          statusCode: number;
      }
> => {
    const contentLength = Number(req.headers["content-length"]);
    if (Number.isNaN(contentLength)) {
        return { status: "error", statusCode: 411 };
    }

    const data = new Uint8Array(contentLength);
    let currentOffset = 0;

    return new Promise((resolve) => {
        const handleData = (chunk: Buffer) => {
            const chunkLength = Buffer.byteLength(chunk);
            const nextOffset = currentOffset + chunkLength;

            if (nextOffset > contentLength) {
                req.off("data", handleData);
                return resolve({ status: "error", statusCode: 400 });
            }

            data.set(chunk, currentOffset);
            currentOffset = nextOffset;
        };

        req.on("data", handleData);
        req.on("end", () => {
            if (contentLength !== currentOffset) {
                return resolve({ status: "error", statusCode: 400 });
            }

            return resolve({ data, status: "success" });
        });
    });
};
