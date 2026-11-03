import { useEffect } from 'react';
import { useQuery, useQueryClient, QueryClient, UseQueryResult } from '@tanstack/react-query';
import Axios from 'axios';

import { ForecastRecord } from '@/lib/forecast/types';
import { createForecastProvider } from '@/lib/forecast/providers';

// Singleton so the underlying provider's circuit breaker (see
// yr-location-forecast.provider.ts) actually tracks failures across
// requests instead of resetting per call.
const forecastProvider = createForecastProvider();

export const forecastQueryKey = (latitude: number | undefined, longitude: number | undefined) =>
  ['forecast', latitude, longitude] as const;

// Nothing else bounds how many distinct points end up cached — every city
// row in NoLocation's list, every favourite, every search result, all get
// their own cache entry that otherwise sticks around until gcTime. Cap it
// to the most recently fetched points instead.
export const MAX_CACHED_FORECAST_POINTS = 20;

// Forecasts go stale half as often as alerts (see ALERTS_STALE_TIME in
// alerts.hook.ts) — the weather doesn't turn over as fast as a CAP feed
// can publish a new warning.
const FORECAST_STALE_TIME = 60 * 60 * 1000;

// Evicts the least-recently-fetched forecast entry once the cache holds
// more than MAX_CACHED_FORECAST_POINTS points other than the one just
// requested. Keyed off `dataUpdatedAt` rather than a separate LRU list, so
// this self-corrects across app restarts for free — that timestamp is
// part of what the persister already saves and restores per query.
export function evictOldestForecastEntry(queryClient: QueryClient, latitude: number, longitude: number): void {
  const others = queryClient
    .getQueryCache()
    .findAll({ queryKey: ['forecast'] })
    .filter(query => !(query.queryKey[1] === latitude && query.queryKey[2] === longitude));

  if (others.length < MAX_CACHED_FORECAST_POINTS) return;

  const oldest = others.reduce((a, b) => (a.state.dataUpdatedAt <= b.state.dataUpdatedAt ? a : b));
  queryClient.getQueryCache().remove(oldest);
}

// latitude/longitude are optional so callers can pass the location before
// it's resolved (e.g. GPS still pending) — the query just stays disabled
// until both are known.
export function useForecastQuery(latitude: number | undefined, longitude: number | undefined): UseQueryResult<ForecastRecord, Error> {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (latitude !== undefined && longitude !== undefined) {
      evictOldestForecastEntry(queryClient, latitude, longitude);
    }
  }, [queryClient, latitude, longitude]);

  return useQuery({
    queryKey: forecastQueryKey(latitude, longitude),
    queryFn: async () => {
      try {
        return await forecastProvider.getForecast(latitude!, longitude!);
      } catch (error) {
        if (Axios.isAxiosError(error)) {
          console.error('Axios error:', error.response?.data || error.message);
        } else {
          console.error('Non-Axios error:' + error);
        }
        throw new Error('There was a problem getting the weather. Please try again later.');
      }
    },
    enabled: latitude !== undefined && longitude !== undefined,
    staleTime: FORECAST_STALE_TIME,
  });
}

type ReturnType = [
  loading: boolean,
  forecast: ForecastRecord | undefined,
  error: Error | undefined,
  retry: () => void,
];

// Tuple-shaped adapter kept for LocationRow's existing call sites.
export function useForecast(latitude: number, longitude: number): ReturnType {
  const { data, isLoading, error, refetch } = useForecastQuery(latitude, longitude);
  return [isLoading, data, error ?? undefined, () => { refetch(); }];
}
