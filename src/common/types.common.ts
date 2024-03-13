import { DaySummary } from "../utils/weatherData";

export type RootDrawerParamList = {
  Hourly: { location: string, daySummary: DaySummary|undefined, title: string };
  NoLocation: undefined;
  Search: undefined;
  Home: undefined;
  AboutUs: undefined;
  Feedback: undefined;
};
