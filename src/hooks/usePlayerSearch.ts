import { useState, useEffect, useDeferredValue, useCallback } from 'react';
import type { Player } from '../types';

export function usePlayerSearch(
  searchFn: (query: string) => Promise<Player[]>
) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Player[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const deferredQuery = useDeferredValue(query);

  useEffect(() => {
    if (deferredQuery.length < 2) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    searchFn(deferredQuery).then((players) => {
      if (!cancelled) {
        setResults(players);
        setIsLoading(false);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [deferredQuery, searchFn]);

  const clear = useCallback(() => {
    setQuery('');
    setResults([]);
  }, []);

  return { query, setQuery, results, isLoading, clear };
}
