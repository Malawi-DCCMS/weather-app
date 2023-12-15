import { ForecastTimestep, WeatherForecast } from "../utils/locationforecast";

export type RootDrawerParamList = {
  Hourly: { name: string, forecast: WeatherForecast, title: string };
  Day: { name: string, forecast: Array<ForecastTimestep> };
  NoLocation: undefined;
  Search: undefined;
  Home: undefined;
};