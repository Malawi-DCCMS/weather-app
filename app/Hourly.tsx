import { Redirect, Href, useLocalSearchParams } from 'expo-router';

import { SCREENS } from '@/lib/layout/constants';

// The hourly breakdown moved into the Five Days tab's stack. Keeps old
// deep links pointing at /Hourly working, with their params.
export default function HourlyRedirect() {
  const params = useLocalSearchParams();
  return <Redirect href={{ pathname: SCREENS.Hourly, params } as Href} />;
}
