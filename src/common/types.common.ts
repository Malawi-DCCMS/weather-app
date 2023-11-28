import { WeatherForecast } from "../utils/locationforecast";

export type RootDrawerParamList = {
  Hourly: { name: string, forecast: WeatherForecast };
  NoLocation: undefined;
  Search: undefined;
  Home: undefined;
};