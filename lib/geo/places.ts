import geonames from '../../assets/geonames.json'
import { Location } from '@/lib/geo/location';

export type Place = {
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number|null;
  admin1?: string|null;
  admin2?: string|null;
  feature?: string|null;
}

export function snapToPlace(location: Location): Place | undefined {
  if (!insideMalawi(location)) {
    return;
  }
  return closestPlace(location);
}

function closestPlace(location: Location): Place | undefined {
  let closest: {distance: number, place: Place|undefined} = {distance: 9_000_000, place: undefined};

  for (const geoname of geonames) {
    const distance = getDistance(location, {lat: geoname.latitude, long: geoname.longitude });
    if (distance < closest.distance) {
      closest = {distance: distance, place: geoname};
    }
  }

  return closest.place
}

function getDistance(point1: Location, point2: Location): number {
  const radlat1 = (Math.PI * point1.lat) / 180;
  const radlat2 = (Math.PI * point2.lat) / 180;
  const theta = point1.long - point2.long;
  const radtheta = (Math.PI * theta) / 180;

  let dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }

  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  dist = dist * 1.609344;

  return dist;
}

function insideMalawi(position: Location): boolean {
  // long downleft, lat downleft, long upperright, lat upperright
  const bbox = [32.6881653175, -16.8012997372, 35.7719047381, -9.23059905359];

  if (
    position.lat > bbox[1] &&
    position.lat < bbox[3] &&
    position.long > bbox[0 && position.long < bbox[2]]
  ) {
    return true;
  }

  return false;
}
