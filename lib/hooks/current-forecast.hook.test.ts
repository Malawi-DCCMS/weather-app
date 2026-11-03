import { QueryClient } from '@tanstack/react-query';

import { evictOldestForecastEntry, forecastQueryKey, MAX_CACHED_FORECAST_POINTS } from './current-forecast.hook';

const seedPoints = (queryClient: QueryClient, count: number, offset = 0) => {
  for (let i = offset; i < offset + count; i++) {
    queryClient.setQueryData(forecastQueryKey(i, i), { days: [] });
  }
};

const forecastKeys = (queryClient: QueryClient) =>
  queryClient.getQueryCache().findAll({ queryKey: ['forecast'] });

describe('evictOldestForecastEntry', () => {
  test('does nothing while at or under the cap', () => {
    const queryClient = new QueryClient();
    seedPoints(queryClient, MAX_CACHED_FORECAST_POINTS);

    evictOldestForecastEntry(queryClient, MAX_CACHED_FORECAST_POINTS - 1, MAX_CACHED_FORECAST_POINTS - 1);

    expect(forecastKeys(queryClient)).toHaveLength(MAX_CACHED_FORECAST_POINTS);
  });

  test('evicts the least-recently-fetched point once one past the cap is requested', () => {
    const queryClient = new QueryClient();
    seedPoints(queryClient, MAX_CACHED_FORECAST_POINTS); // points 0..N-1, point 0 fetched first (oldest)

    const newPoint = MAX_CACHED_FORECAST_POINTS;
    queryClient.setQueryData(forecastQueryKey(newPoint, newPoint), { days: [] });
    evictOldestForecastEntry(queryClient, newPoint, newPoint);

    const remaining = forecastKeys(queryClient);
    expect(remaining).toHaveLength(MAX_CACHED_FORECAST_POINTS);
    expect(remaining.some(q => q.queryKey[1] === 0 && q.queryKey[2] === 0)).toBe(false);
    expect(remaining.some(q => q.queryKey[1] === newPoint && q.queryKey[2] === newPoint)).toBe(true);
  });

  test('never evicts the point that was just requested, even if it is the oldest', () => {
    const queryClient = new QueryClient();
    seedPoints(queryClient, MAX_CACHED_FORECAST_POINTS); // point 0 is oldest

    evictOldestForecastEntry(queryClient, 0, 0);

    const remaining = forecastKeys(queryClient);
    expect(remaining).toHaveLength(MAX_CACHED_FORECAST_POINTS);
    expect(remaining.some(q => q.queryKey[1] === 0 && q.queryKey[2] === 0)).toBe(true);
  });

  test('leaves other query cache entries (e.g. alerts) untouched', () => {
    const queryClient = new QueryClient();
    seedPoints(queryClient, MAX_CACHED_FORECAST_POINTS);
    queryClient.setQueryData(['alerts'], []);

    const newPoint = MAX_CACHED_FORECAST_POINTS;
    queryClient.setQueryData(forecastQueryKey(newPoint, newPoint), { days: [] });
    evictOldestForecastEntry(queryClient, newPoint, newPoint);

    expect(queryClient.getQueryData(['alerts'])).toEqual([]);
  });
});
