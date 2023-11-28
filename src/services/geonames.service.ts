import { GEONAMES } from '../../assets/geonames';

function placeFromGeoname(value: string): Geoname | undefined {
  const fields = value.split(/\t/);
  const lat = parseFloat(fields[4]);
  const long = parseFloat(fields[5]);
  if (isNaN(lat) || isNaN(long)) {
    return;
  }

  return {
    lat: parseFloat(fields[4]),
    long: parseFloat(fields[5]),
    name: fields[1],
  };
}

function parseGeonames(geonames: string): Array<string> {
  return geonames.split(/\r?\n/);
}

export function getGeonames(): Array<Geoname> {
  const rawPlaces = parseGeonames(GEONAMES);
  return rawPlaces.reduce((acc: Array<Geoname>, val) => {
    const place = placeFromGeoname(val);
    if (place) {
      acc.push(place);
    }
    return acc;
  }, []);
}
