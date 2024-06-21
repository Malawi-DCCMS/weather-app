/**
 * Download a weather forecast from api.met.no/weatherapi/locationforecast or a similar service.
 *
 * Ensures that a uses agent is set on each request.
 */
export class Forecaster {
  readonly userAgent: string;
  readonly baseURL: string =
    'https://api.met.no/weatherapi/locationforecast/2.0/';

  constructor(userAgent: string, baseURL?: string) {
    this.userAgent = userAgent;
    if (baseURL !== undefined) {
      this.baseURL = baseURL;
    }
  }

  async getForecast(
    latitude: number,
    longitude: number,
    altitude?: number,
  ): Promise<LocationForecast | undefined> {
    let url =
      this.baseURL +
      '?lat=' +
      latitude.toFixed(4) +
      '&lon=' +
      longitude.toFixed(4);
    if (altitude !== undefined) {
      url += '&altitude=' + altitude.toFixed(0);
    }

    try {
      let response = await fetch(url, {
        headers: {
          'User-Agent': this.userAgent,
        },
      });
      return await response.json();
    } catch (err) {
      const error = err as Error;
      console.log(error.message);
      return undefined;
    }
  }
}

export interface LocationForecast {
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
