declare module '*.png' {
  const value: any;
  export = value;
}

declare module '@env' {
  export const FB_ID: string;
  export const CAP_FEED_URL: string;
  // other ones
}

type Location = {lat: number; long: number};

type Place = {
  position: Location;
  name: string;
};
