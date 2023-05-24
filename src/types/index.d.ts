declare module '*.png' {
  const value: any;
  export = value;
}

type Location = {lat: number; long: number};

type Place = {
  position: Location;
  name: string;
};

type Geoname = {
  name: string;
  lat: number;
  long: number;
};
