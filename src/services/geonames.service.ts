import { GEONAMESUNIQUE } from '../../assets/geonames-unique';

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

export function getGeonames(): Record<string, Geoname> {
  const rawPlaces = parseGeonames(GEONAMESUNIQUE);

  return rawPlaces.reduce(
    (acc: Record<string, Geoname>, val) => {
      const place = placeFromGeoname(val);
      if (place) {
        ((acc[place.name] = place), acc)
      }
      return acc
    },
    {},
  );

  // return rawPlaces.reduce((acc: Array<Geoname>, val) => {
  //   const place = placeFromGeoname(val);
  //   if (place) {
  //     acc.push(place);
  //   }
  //   return acc;
  // }, []);
}
