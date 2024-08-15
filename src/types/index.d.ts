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
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  admin1?: string;
  admin2?: string;
  feature?: string;
}