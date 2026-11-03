import { useCallback, useState } from 'react';

type RetryMap = Record<string, () => void>;

// Shared by Favourites and NoLocation: each renders a list of LocationRow
// cards that fetch independently, and a failed fetch should surface as
// ONE consolidated error card for the screen rather than one per row.
// Rows report their error state here instead of rendering their own card.
export function useLocationRowErrors() {
  const [retries, setRetries] = useState<RetryMap>({});

  const onErrorChange = useCallback((id: string, retry: (() => void) | undefined) => {
    setRetries(prev => {
      if (!retry) {
        if (!(id in prev)) return prev;
        const next = { ...prev };
        delete next[id];
        return next;
      }
      return { ...prev, [id]: retry };
    });
  }, []);

  const retryAll = useCallback(() => {
    Object.values(retries).forEach(retry => retry());
  }, [retries]);

  return { hasErrors: Object.keys(retries).length > 0, onErrorChange, retryAll };
}
