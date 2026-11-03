import { useQuery, UseQueryResult } from '@tanstack/react-query';

import { CAPAlert, alertLevel } from '@/lib/alerts/providers/cap-alerts/alert';
import { createAlertsProvider } from '@/lib/alerts/providers';

// Singleton so the underlying CAPCollector's incremental If-Modified-Since
// polling (see collector.ts) actually persists across refetches instead of
// starting over on every call.
const alertsProvider = createAlertsProvider();

const levelYellowAndAbove = (alert: CAPAlert): boolean => {
  if (!alert.info || !alert.info.length) {
    return false;
  }
  switch (alertLevel(alert.info[0])) {
    case 'Red':
    case 'Orange':
    case 'Yellow':
      return true;
    default:
      return false;
  }
};

export const ALERTS_QUERY_KEY = ['alerts'] as const;

// Alerts go stale twice as fast as the forecast (see forecastQueryKey's
// useForecastQuery) — a CAP feed can publish a new warning at any time, so
// it's worth checking more often than "how's the weather looking" data.
const ALERTS_STALE_TIME = 30 * 60 * 1000;

export function useAlertsQuery(): UseQueryResult<CAPAlert[], Error> {
  return useQuery({
    queryKey: ALERTS_QUERY_KEY,
    queryFn: async () => {
      try {
        const alerts = await alertsProvider.getAlerts();
        return alerts.filter(levelYellowAndAbove);
      } catch (error) {
        console.error('Loading alerts rejected:', error);
        throw new Error('There was a problem getting the location alerts. Please try again later.');
      }
    },
    staleTime: ALERTS_STALE_TIME,
  });
}
