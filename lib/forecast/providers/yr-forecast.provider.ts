import { DateTime } from "luxon";

import { APP_TIMEZONE } from "@/config";
import { YrForecast, YrForecastTimestep, ForecastRecord, ForecastDayRecord, ForecastStepRecord } from "../types";
import { ForecastProviderInterface } from "../interfaces";
import { toCelsius, toMetresPerSecond, toMillimetres } from "@/lib/units";
import { YrLocationForecastProvider } from "./yr-location-forecast.provider";

export class YrForecastProvider implements ForecastProviderInterface {
  private readonly locationProvider = new YrLocationForecastProvider();

  async getForecast(lat: number, lon: number, alt?: number): Promise<ForecastRecord> {
    const raw = await this.locationProvider.getForecast(lat, lon, alt);
    return parseYrForecast(raw);
  }
}

// Units the response declares (meta.units). Values are normalised to the
// app's canonical °C / m/s / mm here, so nothing downstream depends on what
// a given backend happens to send.
type SourceUnits = YrForecast["properties"]["meta"]["units"];

export function parseYrForecast(raw: YrForecast): ForecastRecord {
  const units: SourceUnits = raw.properties.meta?.units ?? {};
  const dayMap = new Map<string, YrForecastTimestep[]>();

  for (const step of raw.properties.timeseries) {
    const dayKey = DateTime.fromISO(step.time).setZone(APP_TIMEZONE).startOf("day").toISO()!;
    if (!dayMap.has(dayKey)) dayMap.set(dayKey, []);
    dayMap.get(dayKey)!.push(step);
  }

  const days: ForecastDayRecord[] = [];
  for (const [dayIso, daySteps] of dayMap) {
    days.push(parseDayRecord(dayIso, daySteps, units));
  }

  return { days };
}

function parseDayRecord(dayIso: string, rawSteps: YrForecastTimestep[], units: SourceUnits): ForecastDayRecord {
  const temperatures = rawSteps
    .map(s => s.data.instant.details.air_temperature)
    .filter((t): t is number => t !== undefined)
    .map(t => toCelsius(t, units.air_temperature));

  const windSpeeds = rawSteps
    .map(s => s.data.instant.details.wind_speed)
    .filter((w): w is number => w !== undefined)
    .map(w => toMetresPerSecond(w, units.wind_speed));

  return {
    day: dayIso,
    weatherSymbol: selectDailyWeatherSymbol(rawSteps),
    maxTemperature: temperatures.length ? Math.max(...temperatures) : undefined,
    minTemperature: temperatures.length ? Math.min(...temperatures) : undefined,
    windSpeed: windSpeeds.length ? Math.max(...windSpeeds) : undefined,
    steps: rawSteps.map(step => parseStepRecord(step, units)),
  };
}

function parseStepRecord(step: YrForecastTimestep, units: SourceUnits): ForecastStepRecord {
  const temperature = step.data.instant.details.air_temperature;
  const windSpeed = step.data.instant.details.wind_speed;
  const precip1h = step.data.next_1_hours?.details?.precipitation_amount;
  const precip6h = step.data.next_6_hours?.details?.precipitation_amount;
  const precipitation = precip1h ?? precip6h;

  return {
    time: DateTime.fromISO(step.time).setZone(APP_TIMEZONE).toISO()!,
    temperature: temperature !== undefined ? toCelsius(temperature, units.air_temperature) : undefined,
    windSpeed: windSpeed !== undefined ? toMetresPerSecond(windSpeed, units.wind_speed) : undefined,
    precipitation: precipitation !== undefined ? toMillimetres(precipitation, units.precipitation_amount) : "-",
    weatherSymbol:
      step.data.next_1_hours?.summary?.symbol_code ??
      step.data.next_6_hours?.summary?.symbol_code ??
      "??",
  };
}

function selectDailyWeatherSymbol(steps: YrForecastTimestep[]): string | undefined {
  if (steps.length === 0) return undefined;

  const firstHour = DateTime.fromISO(steps[0].time).setZone(APP_TIMEZONE).hour;

  if (firstHour <= 6) {
    return getFullDaySymbol(steps) ?? getBestAvailableSymbol(steps);
  }

  if (firstHour <= 12) {
    const noonStep = steps.find(s => DateTime.fromISO(s.time).setZone(APP_TIMEZONE).hour === 12);
    const symbol =
      noonStep?.data.next_6_hours?.summary?.symbol_code ??
      noonStep?.data.next_1_hours?.summary?.symbol_code;
    return symbol ?? getBestAvailableSymbol(steps);
  }

  return (
    steps[0].data.next_1_hours?.summary?.symbol_code ??
    steps[0].data.next_6_hours?.summary?.symbol_code ??
    getBestAvailableSymbol(steps)
  );
}

function getFullDaySymbol(steps: YrForecastTimestep[]): string | undefined {
  // Anchor to 6 UTC (8am local in UTC+2). next_12h covers 8am–8pm local — full daytime.
  const step = steps.find(s => DateTime.fromISO(s.time).setZone("utc").hour === 6);
  return step?.data.next_12_hours?.summary?.symbol_code;
}

function getBestAvailableSymbol(steps: YrForecastTimestep[]): string | undefined {
  const daytimeSteps = steps.filter(s => {
    const h = DateTime.fromISO(s.time).setZone(APP_TIMEZONE).hour;
    return h >= 6 && h < 20;
  });
  const sorted = [...daytimeSteps].sort((a, b) => {
    const ha = DateTime.fromISO(a.time).setZone(APP_TIMEZONE).hour;
    const hb = DateTime.fromISO(b.time).setZone(APP_TIMEZONE).hour;
    return Math.abs(ha - 12) - Math.abs(hb - 12);
  });
  for (const step of sorted) {
    const symbol =
      step.data.next_12_hours?.summary?.symbol_code ??
      step.data.next_6_hours?.summary?.symbol_code ??
      step.data.next_1_hours?.summary?.symbol_code;
    if (symbol) return symbol;
  }
  return undefined;
}
