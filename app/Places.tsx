import { Redirect, Href } from 'expo-router';

import { SCREENS } from '@/lib/layout/constants';

// "Places" was renamed to Favourites and moved under the More tab. Keeps
// old deep links (climweb.weatherapp://Places) and notification payloads
// pointing at /Places working.
export default function PlacesRedirect() {
  return <Redirect href={SCREENS.Favourites.toString() as Href} />;
}
