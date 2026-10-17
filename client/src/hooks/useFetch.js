import { useCallback, useEffect, useState } from 'react';

/**
 * Run an async fetcher and expose `{ data, loading, error, retry }`.
 *
 * The fetcher receives `{ signal }` so in-flight requests are aborted when the
 * component unmounts or the dependencies change; state is never set afterwards.
 *
 * @param {(options: { signal: AbortSignal }) => Promise<unknown>} fetcher
 * @param {unknown[]} deps
 */
export function useFetch(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const [attempt, setAttempt] = useState(0);

  // The fetcher is usually an inline arrow function; deps decide when to re-run.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(fetcher, deps);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setState({ data: null, loading: true, error: null });

    run({ signal: controller.signal })
      .then((data) => {
        if (active) setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (!active || error?.name === 'AbortError') return;
        setState({ data: null, loading: false, error: error.message || 'Something went wrong' });
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [run, attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { ...state, retry };
}

export default useFetch;
