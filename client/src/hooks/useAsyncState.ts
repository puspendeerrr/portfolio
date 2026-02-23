/**
 * Loading and Error State Hook
 * Manages loading and error states for async operations
 */

import { useState, useCallback } from 'react';

interface AsyncState {
  loading: boolean;
  error: string | null;
}

interface UseAsyncReturn extends AsyncState {
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAsyncState = (): UseAsyncReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setLoading(false);
    setError(null);
  }, []);

  return { loading, error, setLoading, setError, reset };
};

/**
 * Hook to execute async operations with loading and error handling
 */
export const useAsync = <T,>(
  asyncFunction: () => Promise<T>,
  immediate = true
) => {
  const [value, setValue] = useState<T | null>(null);
  const { loading, error, setLoading, setError, reset } = useAsyncState();

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await asyncFunction();
      setValue(result);
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [asyncFunction, setLoading, setError]);

  return { value, loading, error, execute, reset };
};
