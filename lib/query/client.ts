import { AppState, Platform } from 'react-native';
import { QueryClient, focusManager } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

import { jsonStorage } from '@/lib/storage';

// How long persisted cache entries are trusted for after a cold start —
// independent of staleTime, which just governs when a background refetch
// kicks in. Restored data still renders immediately either way; this only
// bounds how old it's allowed to be before being discarded outright (e.g.
// after the app hasn't been opened in days).
const PERSIST_MAX_AGE = 24 * 60 * 60 * 1000;

// Forecast/alerts providers already retry against a fallback URL behind a
// circuit breaker (see yr-location-forecast.provider.ts / rss.ts) — by the
// time queryFn rejects, it's already exhausted primary + fallback, so a
// Query-level retry here would just re-run that whole sequence a second
// time and double the latency of an already-degraded failure.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      // Forecast/alerts each set their own staleTime (see FORECAST_STALE_TIME
      // in current-forecast.hook.ts and ALERTS_STALE_TIME in alerts.hook.ts)
      // — they go stale at different rates, so there's no one sensible
      // default to fall back to here.
      // Must be >= persister's maxAge, or restored entries older than
      // staleTime's usual gcTime get garbage-collected right after restore.
      gcTime: PERSIST_MAX_AGE,
    },
  },
});

// jsonStorage's reads/writes are synchronous under the hood (MMKV, or its
// web localStorage shim), but AsyncStorage's interface accepts sync values
// too — so restoration is still effectively instant, just going through
// the non-deprecated persister API. The last-seen forecast/alerts render
// immediately on a cold start, with a background refetch following per
// the staleTime above.
export const persistOptions = {
  persister: createAsyncStoragePersister({ storage: jsonStorage, key: 'query-cache' }),
  maxAge: PERSIST_MAX_AGE,
  // Bump when the shape or units of cached data change, so caches saved by
  // an older build are discarded instead of misread. v2: forecast values
  // stored in canonical units (wind in m/s, previously km/h).
  buster: 'v2-canonical-units',
};

// React Native has no browser "window focus" event; Query's web default
// (refetchOnWindowFocus) is a no-op here unless focusManager is told to
// use AppState instead — this makes coming back to the foreground refetch
// stale queries, e.g. the forecast/alerts after being backgrounded a while.
if (Platform.OS !== 'web') {
  focusManager.setEventListener(handleFocus => {
    const subscription = AppState.addEventListener('change', state => {
      handleFocus(state === 'active');
    });
    return () => subscription.remove();
  });
}
