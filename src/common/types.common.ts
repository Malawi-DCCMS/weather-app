import { CAPAlert } from "../lib/cap-client/alert";
import { WeatherDataDaySummary } from "../utils/weatherData";

export type RootDrawerParamList = {
  Hourly: { location: string, dayString: string|null, onlyFuture: boolean, title: string };
  NoLocation: undefined;
  Search: undefined;
  Home: undefined;
  AboutUs: undefined;
  AboutTheApp: undefined;
  Feedback: undefined;
  WeatherWarning: { location: string, alert: CAPAlert };
};
