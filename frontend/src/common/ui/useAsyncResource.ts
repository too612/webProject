import { useCallback, useEffect, useState } from "react";
import { getApiErrorMessage } from "../api/apiError";

export function useAsyncResource<T>(
  loader: (signal: AbortSignal) => Promise<T>,
  errorMessage: string,
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [revision, setRevision] = useState(0);
  const retry = useCallback(() => setRevision((value) => value + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    setData(null);
    Promise.resolve().then(() => loader(controller.signal))
      .then((result) => {
        if (!controller.signal.aborted) setData(result);
      })
      .catch((cause: unknown) => {
        if (!controller.signal.aborted) setError(getApiErrorMessage(cause, errorMessage));
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [loader, errorMessage, revision]);

  return { data, loading, error, retry };
}
