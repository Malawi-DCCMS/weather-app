import { FORECAST_DESCRIPTIONS } from '../constants/forecast-descriptions.constant';

export function getForecastDescription(key: string): string {
  return FORECAST_DESCRIPTIONS[key];
}
