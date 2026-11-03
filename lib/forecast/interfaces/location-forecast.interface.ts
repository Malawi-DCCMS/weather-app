export interface LocationForecastInterface<T> {
  getForecast(lat: number, lon: number, alt?: number): Promise<T>;
}
