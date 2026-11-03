import { Redirect, Href, useLocalSearchParams } from 'expo-router';

import { SCREENS } from '@/lib/layout/constants';

// Warning details moved into the Alerts tab's stack. Keeps old deep links
// and notification payloads pointing at /WeatherWarning working.
export default function WeatherWarningRedirect() {
  const params = useLocalSearchParams<{ location: string, alertID: string }>();
  return <Redirect href={{ pathname: SCREENS.WeatherWarning, params } as Href} />;
}
