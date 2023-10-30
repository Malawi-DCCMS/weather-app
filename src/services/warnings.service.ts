import { WeatherWarning } from "../types/weather-warning.type";

export function getWarnings(lat: number, lon: number): Promise<Array<WeatherWarning>> {
  const warnings: Array<WeatherWarning> = [
    {
      severity: 'extreme',
      polygon: '12434, 3232, 445',
      message: 'xxxxx',
      description: 'xxxxx',
      startTime: new Date(),
      endTime: new Date(),
      action: 'run',
    },
  ];
  return Promise.resolve(warnings);
}
