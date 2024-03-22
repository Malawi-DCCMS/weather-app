import { GEONAMESUNIQUE } from '../../assets/geonames-unique';

export function snapToPlace(location: Location): Place | undefined {
  if (!insideMalawi(location)) {
    return;
  }
  const places = getPlaces();
  return closestPlace(places, location);
}

function getPlaces(): Array<Place> {
  const rawPlaces = parseGeonames(GEONAMESUNIQUE);
  return rawPlaces.reduce((acc: Array<Place>, val) => {
    const place = placeFromGeoname(val);
    if (place) {
      acc.push(place);
    }
    return acc;
  }, []);
}

function closestPlace(places: Place[], location: Location): Place | undefined {
  let closest: [distance: number, place: Place] = [9_000_000, {name: '', position: {lat:0, long:0}}]

  for (const val of places) {
    const distance = getDistance(location, val.position);
    if (distance < closest[0]) {
      closest = [distance, val];
    }
  }

  if (closest[1].name === ''){
    return undefined
  }
  
  return closest[1];
}

function placeFromGeoname(value: string): Place | undefined {
  const fields = value.split(/\t/);
  const lat = parseFloat(fields[4]);
  const long = parseFloat(fields[5]);
  // ignore place if lat or long could not be parsed into float.
  if (isNaN(lat) || isNaN(long)) {
    return;
  }

  return {
    position: {
      lat: parseFloat(fields[4]),
      long: parseFloat(fields[5]),
    },
    name: fields[1],
  };
}

function parseGeonames(geonames: string): Array<string> {
  return geonames.split(/\r?\n/);
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
