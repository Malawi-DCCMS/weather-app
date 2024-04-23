import { DaySummary } from "../utils/weatherData";

export type RootDrawerParamList = {
  Hourly: { location: string, daySummary: DaySummary, title: string };
  NoLocation: undefined;
  Search: undefined;
  Home: undefined;
  AboutUs: undefined;
  Feedback: undefined;
  WeatherWarning: { location: string };
};
