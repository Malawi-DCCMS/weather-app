import { DateTime } from "luxon";

// Yr/MET Norway Locationforecast raw response types

export interface YrForecast {
    type: string;
    geometry: {
      type: 'Point';
      coordinates: number[];
    };
    properties: {
      meta: {
        updated_at: string;
        units: {
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
      timeseries: YrForecastTimestep[];
    };
}

export interface YrForecastDetails {
    air_temperature_min?: number;
    air_temperature_max?: number;
    precipitation_amount?: number;
    precipitation_amount_max?: number;
    precipitation_amount_min?: number;
    probability_of_precipitation?: number;
    probability_of_thunder?: number;
    ultraviolet_index_clear_sky_max?: number;
}

export interface YrForecastPeriod {
    details?: YrForecastDetails;
    summary?: {
      symbol_code?: string;
    };
}

export interface YrForecastTimestep {
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
      next_1_hours?: YrForecastPeriod;
      next_6_hours?: YrForecastPeriod;
      next_12_hours?: YrForecastPeriod;
    };
}

// App-facing serializable forecast types stored in Redux

// Values are in canonical units — °C, m/s, mm — whatever the source API
// sent (see lib/units). Convert for display with useUnits().
export interface ForecastStepRecord {
  time: string;                 // ISO string — Redux-safe
  temperature?: number;         // °C
  windSpeed?: number;           // m/s
  precipitation: number | "-";  // mm, pre-computed
  weatherSymbol: string;        // pre-computed
}

export interface ForecastDayRecord {
  day: string;                  // ISO date string (start of day in configured timezone)
  weatherSymbol?: string;
  maxTemperature?: number;       // °C
  minTemperature?: number;       // °C
  windSpeed?: number;            // m/s, the day's highest
  steps: ForecastStepRecord[];
}

export interface ForecastRecord {
  days: ForecastDayRecord[];
}
