import { DateTime } from "luxon";
import { ForecastTimestep, Forecast } from "./types";

const timeZone = "Africa/Blantyre";

/**
 * Prepared forecast data.
 * The purpose of this class is to move all logic related to selecting forecast data to show into a single location.
 * Presentation code should just call method or read data from here instead of making their own aggregations/selections of data.
 */
export class WeatherData {
  timeSteps: WeatherDataTimestep[];

  constructor(forecastDocument: Forecast) {
    this.timeSteps = [];

    for (const timestep of forecastDocument.properties.timeseries) {
      let data = new WeatherDataTimestep(timestep);
      this.timeSteps.push(data);
    }
  }

  /**
   * Get a list of all days we have data for.
   *
   * @returns A list of dates for which we have data, all with the clock set to 00:00
   */
  days(): DateTime[] {
    let ret = [this.timeSteps[0].time.startOf("day")];
    for (const step of this.timeSteps) {
      const t = step.time.startOf("day");
      if (!t.equals(ret[ret.length - 1])) ret.push(t);
    }
    return ret;
  }

  /**
   * Get a summary of the forecast for a single day.
   *
   * @param time Get summary for the day of the specified time.
   * @noValuesBefore Only get values for timesteps after specified time.
   * @returns A summary of the forecast for the given day.
   */
  atDay(
    time: DateTime,
    noValuesBefore: boolean = false,
  ): WeatherDataDaySummary | undefined {
    let timeSteps = this.timeSteps;
    if (noValuesBefore)
      timeSteps = timeSteps.filter((step) => step.time > time);

    time = time.setZone(timeZone).startOf("day");
    let relevantSteps = timeSteps.filter(
      (step) =>
        step.time.year == time.year &&
        step.time.month == time.month &&
        step.time.day == time.day,
    );

    if (relevantSteps.length == 0) return undefined;

    const temperature = getMinMaxTemperature(relevantSteps);
    const windSpeed = getMaxWindSpeed(relevantSteps);
    const weatherSymbol = getDailyWeatherSymbol(relevantSteps);

    return {
      day: time,
      weatherSymbol: weatherSymbol,
      windSpeed: windSpeed,
      maxTemperature: temperature.max,
      minTemperature: temperature.min,
      steps: timeSteps.filter((step) => step.time.startOf("day").equals(time)),
    };
  }
}

/**
 * Weather data for a single time step.
 * Note that a time step is not neccessarily one hour - it can also be six hours.
 */
export class WeatherDataTimestep {
  time: DateTime;

  temperature?: number;
  windSpeed?: number;
  precipitation_1h?: number;
  precipitation_6h?: number;
  weatherSymbol_1h?: string;
  weatherSymbol_6h?: string;
  weatherSymbol_12h?: string;

  constructor(timestep: ForecastTimestep) {
    this.time = DateTime.fromISO(timestep.time).setZone(timeZone);
    this.temperature = timestep.data.instant.details.air_temperature;
    this.precipitation_1h =
      timestep.data.next_1_hours?.details?.precipitation_amount;
    this.precipitation_6h =
      timestep.data.next_6_hours?.details?.precipitation_amount;
    let windSpeed = timestep.data.instant.details.wind_speed;
    if (windSpeed) {
      // Convert to km/h
      windSpeed *= 3.6;
    }
    this.windSpeed = windSpeed;
    this.weatherSymbol_1h = timestep.data.next_1_hours?.summary?.symbol_code;
    this.weatherSymbol_6h = timestep.data.next_6_hours?.summary?.symbol_code;
    this.weatherSymbol_12h = timestep.data.next_12_hours?.summary?.symbol_code;

    // console.log(this)
  }

  /**
   * Get the precipitation amount for this time step - either for the next hour or for the next six hours.
   */
  precipitation(): number | "-" {
    if (this.precipitation_1h !== undefined) return this.precipitation_1h;
    if (this.precipitation_6h !== undefined) return this.precipitation_6h;
    return "-";
  }

  /**
   * Get the weather symbol for this time step - either for the next hour or for the next six hours.
   */
  weatherSymbol(): string {
    if (this.weatherSymbol_1h !== undefined) return this.weatherSymbol_1h;
    if (this.weatherSymbol_6h !== undefined) return this.weatherSymbol_6h;
    return "??";
  }
}

/**
 * Summary of the weather for a single day
 */
export interface WeatherDataDaySummary {
  day: DateTime;
  weatherSymbol?: string;
  maxTemperature?: number;
  minTemperature?: number;
  windSpeed?: number;

  steps: WeatherDataTimestep[];
}

interface minmax {
  min?: number;
  max?: number;
}
function getMinMaxTemperature(relevantSteps: WeatherDataTimestep[]): minmax {
  let max: number | undefined = -1000;
  let min: number | undefined = 1000;
  for (const step of relevantSteps) {
    const t = step.temperature;
    if (t === undefined) {
      return {};
    }
    if (t > max) max = t;
    if (t < min) min = t;
  }
  return {
    min: min,
    max: max,
  };
}

function getMaxWindSpeed(
  relevantSteps: WeatherDataTimestep[],
): number | undefined {
  let max = 0;
  for (const step of relevantSteps) {
    const val = step.windSpeed;
    if (val === undefined) {
      return undefined;
    }
    if (val > max) max = val;
  }
  return max;
}

function getDailyWeatherSymbol(
  relevantSteps: WeatherDataTimestep[],
): string | undefined {
  if (relevantSteps.length === 0) return undefined;

  const firstHour = relevantSteps[0].time.hour;

  // Full day starting from midnight: look for a symbol covering the whole daytime period.
  if (firstHour <= 6) {
    return (
      getFullDaySymbol(relevantSteps) ?? bestAvailableSymbol(relevantSteps)
    );
  }

  // Partial day starting mid-morning (e.g. today): noon is the best single representative.
  if (firstHour <= 12) {
    const noonStep = relevantSteps.find((v) => v.time.hour === 12);
    const symbol = noonStep?.weatherSymbol_6h ?? noonStep?.weatherSymbol_1h;
    return symbol ?? bestAvailableSymbol(relevantSteps);
  }

  // Partial day starting in the afternoon: use whatever is immediately available.
  const firstStep = relevantSteps[0];
  const symbol = firstStep.weatherSymbol_1h ?? firstStep.weatherSymbol_6h;
  return symbol ?? bestAvailableSymbol(relevantSteps);
}

function getFullDaySymbol(
  relevantSteps: WeatherDataTimestep[],
): string | undefined {
  // Anchor to 6 UTC (8am local). Try progressively shorter forecast windows:
  // next_12h covers 8am–8pm local (full daytime), next_6h covers 8am–2pm, next_1h is just 8am.
  const step = relevantSteps.find((v) => v.time.setZone("utc").hour === 6);
  return step?.weatherSymbol_12h;
}

/**
 * Last-resort symbol picker: walks all daytime steps (6am–8pm local) sorted by
 * closeness to noon, and returns the first symbol found, preferring 12h > 6h > 1h.
 */
function bestAvailableSymbol(steps: WeatherDataTimestep[]): string | undefined {
  const daytimeSteps = steps.filter(
    (v) => v.time.hour >= 6 && v.time.hour < 20,
  );
  const sorted = [...daytimeSteps].sort(
    (a, b) => Math.abs(a.time.hour - 12) - Math.abs(b.time.hour - 12),
  );
  for (const step of sorted) {
    const symbol =
      step.weatherSymbol_12h ?? step.weatherSymbol_6h ?? step.weatherSymbol_1h;
    if (symbol) return symbol;
  }
  return undefined;
}
