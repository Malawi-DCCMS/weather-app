import { CAPAlert } from "../lib/cap-client/alert";
import { Forecast } from "../utils/locationforecast";

export type RootDrawerParamList = {
  Hourly: { location: string, forecast: Forecast, dayString: string|null, noValuesBefore: boolean, title: string };
  NoLocation: undefined;
  Search: undefined;
  Home: undefined;
  AboutUs: undefined;
  AboutTheApp: undefined;
  Feedback: undefined;
  WeatherWarning: { location: string, alert: CAPAlert };
};
