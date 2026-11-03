import { ForecastRecord } from "../types";

export interface ForecastProviderInterface {
  getForecast(lat: number, lon: number, alt?: number): Promise<ForecastRecord>;
}
