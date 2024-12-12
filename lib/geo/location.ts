import * as ExpoLocation from 'expo-location';
import { Place } from '@/lib/geo/places'
import { LOGGER } from '@/lib/utils/logger';

import { snapToPlace } from './places';

export type Location = { lat: number; long: number };

async function queryLocation(): Promise<{ lat: number, lon: number }> {
  const { status } = await ExpoLocation.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    throw new Error('Location permission denied.');
  }
  const position = await ExpoLocation.getCurrentPositionAsync({ accuracy: ExpoLocation.LocationAccuracy.Highest });
  return { lat: position.coords.latitude, lon: position.coords.longitude };
}

const getClosestPlace = (lat: number, lon: number): Place | undefined => {
  const location: Location = { lat, long: lon };
  return snapToPlace(location);
}

export const placeByCurrentLocation = async (): Promise<Place> => {
  try {
    const location = await queryLocation();
    const closest = getClosestPlace(location.lat, location.lon);
    if (!closest) {
      throw new Error('Failed to get closest place to location.' + location);
    }
    return closest as Place;
  } catch (error) {
    LOGGER.error("Failed to get current location")
    throw error
  }
}
