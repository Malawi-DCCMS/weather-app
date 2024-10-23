import { CAPAlert } from "../lib/cap-client/alert";

export interface Forecast {
  type: string;
  geometry: {
    type: 'Point';
    coordinates: number[];
  };
  properties: {
    meta: {
      updated_at: string;
      units:
      {
        air_pressure_at_sea_level?: string;
        air_temperature?: string;
        air_temperature_max?: string;
        air_temperature_min?: string;
        cloud_area_fraction?: string;
        cloud_area_fraction_high?: string;
        cloud_area_fraction_medium?: string;
        cloud_area_fraction_low?: string;
        dew_point_temperature?: string;
        fog_area_fraction?: string;
        precipitation_amount?: string;
        relative_humidity?: string;
        ultraviolet_index_clear_sky?: string;
        wind_from_direction?: string;
        wind_speed?: string;
      };
    };
    timeseries: ForecastTimestep[];
  };
}

export interface ForecastDetails {
  air_temperature_min?: number;
  air_temperature_max?: number;
  precipitation_amount?: number;
  precipitation_amount_max?: number;
  precipitation_amount_min?: number;
  probability_of_precipitation?: number;
  probability_of_thunder?: number;
  ultraviolet_index_clear_sky_max?: number;
}

export interface ForecastPeriod {
  details?: ForecastDetails;
  summary?: {
    symbol_code?: string;
  };
}

export interface ForecastTimestep {
  time: string;
  data: {
    instant: {
      details: {
        air_pressure_at_sea_level?: number;
        air_temperature?: number;
        cloud_area_fraction?: number;
        cloud_area_fraction_high?: number;
        cloud_area_fraction_medium?: number;
        cloud_area_fraction_low?: number;
        dew_point_temperature?: number;
        fog_area_fraction?: number;
        relative_humidity?: number;
        ultraviolet_index_clear_sky?: number;
        wind_from_direction?: number;
        wind_speed?: number;
      };
    };
    next_1_hours?: ForecastPeriod;
    next_6_hours?: ForecastPeriod;
    next_12_hours?: ForecastPeriod;
  };
}

export type RootDrawerParamList = {
  Hourly: { location: string, dayString: string | null, noValuesBefore: boolean, title: string };
  NoLocation: undefined;
  Search: undefined;
  Home: undefined;
  AboutUs: undefined;
  AboutTheApp: undefined;
  Feedback: undefined;
  WeatherWarning: { location: string, alert: CAPAlert };
};
