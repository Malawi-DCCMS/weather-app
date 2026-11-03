import { FORECAST_PROVIDER } from "@/config";
import { ForecastProviderInterface } from "../interfaces";
import { YrForecastProvider } from "./yr-forecast.provider";

export function createForecastProvider(): ForecastProviderInterface {
  switch (FORECAST_PROVIDER) {
    case "yr":
    default:
      return new YrForecastProvider();
  }
}
