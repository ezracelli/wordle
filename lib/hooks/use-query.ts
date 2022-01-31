import { useEffect, useRef, useState } from "preact/hooks";

export type QueryKey = string | readonly unknown[];

const hashQueryKey = <TQueryKey extends QueryKey>(
    queryKey: TQueryKey,
): string => {
    const ensuredQueryKey = ensureQueryKey(queryKey);

    return JSON.stringify(ensuredQueryKey, (_, value) => {
        if (Object.prototype.toString.call(value) !== "[object Object]") {
            return value;
        }

        const prototype = Object.getPrototypeOf(value);
        if (prototype !== null && prototype !== Object.prototype) {
            return value;
        }

        return Object.keys(value)
            .sort()
            .reduce((result, key) => {
                result[key] = value[key];
                return result;
            }, {} as Record<string, unknown>);
    });
};

export type EnsuredQueryKey<TQueryKey extends QueryKey> =
    TQueryKey extends string ? [TQueryKey] : QueryKey;

const ensureQueryKey = <TQueryKey extends QueryKey>(
    queryKey: TQueryKey,
): EnsuredQueryKey<TQueryKey> =>
    (Array.isArray(queryKey)
        ? queryKey
        : [queryKey]) as EnsuredQueryKey<TQueryKey>;

export interface QueryFunctionContext<TQueryKey extends QueryKey> {
    queryKey: EnsuredQueryKey<TQueryKey>;
}

export type QueryFunction<TData, TQueryKey extends QueryKey> = (
    context: QueryFunctionContext<TQueryKey>,
) => TData | Promise<TData>;

export interface UseQueryOptions<TData, TError> {
    enabled?: boolean;
    onError?: (error: TError) => void;
    onSuccess?: (data: TData) => void;
}

export type UseQueryResult<TData, TError> =
    | {
          error: TError;
          status: "error";
      }
    | {
          status: "idle";
      }
    | {
          status: "loading";
      }
    | {
          data: TData;
          status: "success";
      };

export const useQuery = <TData, TError, TQueryKey extends QueryKey>(
    queryKey: TQueryKey,
    queryFn: QueryFunction<TData, TQueryKey>,
    options?: UseQueryOptions<TData, TError>,
): UseQueryResult<TData, TError> => {
    const [result, setResult] = useState<UseQueryResult<TData, TError>>(
        options?.enabled === false ? { status: "idle" } : { status: "loading" },
    );

    const queryFn_ = useRef(queryFn);
    useEffect(() => {
        queryFn_.current = queryFn;
    }, [queryFn]);

    const onError_ = useRef(options?.onError);
    const onSuccess_ = useRef(options?.onSuccess);
    useEffect(() => {
        onError_.current = options?.onError;
        onSuccess_.current = options?.onSuccess;
    }, [options]);

    useEffect(() => {
        if (options?.enabled === false) {
            setResult({ status: "idle" });
            return;
        }

        (async () => {
            setResult({ status: "loading" });

            try {
                const data = await queryFn_.current({
                    queryKey: ensureQueryKey(queryKey),
                });

                setResult({ data, status: "success" });
                onSuccess_.current?.(data);
            } catch (err) {
                setResult({ error: err as TError, status: "error" });
                onError_.current?.(err as TError);
            }
        })();
    }, [options?.enabled, hashQueryKey(queryKey)]);

    return result;
};
