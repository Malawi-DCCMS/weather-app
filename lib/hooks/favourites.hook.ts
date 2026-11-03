import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';

import { storage } from '@/lib/storage';
import { Place } from '@/lib/geo/places';

// Still 'places.*' from before the Places -> Favourites rename. Don't
// change it: existing installs read their saved favourites from this key.
const FAVOURITES_KEY = 'places.favourites';

export const MAX_FAVOURITE_PLACES = 5;

type ReturnType = [
  loading: boolean,
  favourites: Place[],
  saveFavourites: (places: Place[]) => Promise<void>,
];

const readFavourites = (): Place[] => {
  const value = storage.getString(FAVOURITES_KEY);
  return value ? JSON.parse(value) : [];
};

const favouritesEqual = (a: Place[], b: Place[]): boolean =>
  a.length === b.length && JSON.stringify(a) === JSON.stringify(b);

// Favourites are a device-local setting, not domain data, so they live in
// storage rather than the location store. Re-reads on focus (not just on
// mount) so the Favourites page picks up edits made on EditFavourites/
// OnboardingPlaces without needing to remount. MMKV reads are synchronous,
// so `loading` is always false — kept in the tuple for API compatibility.
export function useFavourites(): ReturnType {
  const [favourites, setFavourites] = useState<Place[]>(readFavourites);

  useFocusEffect(
    useCallback(() => {
      // Every focus (e.g. tab switches, not just actual edits) would
      // otherwise produce a brand-new array reference here even when the
      // stored data hasn't changed, cascading a re-render through every
      // LocationRow on the Favourites page despite React.memo — bail out of
      // the state update entirely when the content is unchanged instead.
      setFavourites(prev => {
        const next = readFavourites();
        return favouritesEqual(prev, next) ? prev : next;
      });
    }, [])
  );

  const saveFavourites = useCallback(async (places: Place[]) => {
    setFavourites(places);
    storage.set(FAVOURITES_KEY, JSON.stringify(places));
  }, []);

  return [false, favourites, saveFavourites];
}
