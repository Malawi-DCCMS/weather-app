import { DateTime } from "luxon";
import { parseYrForecast } from "./providers";
import { YrForecast } from "./types";
import { APP_TIMEZONE } from "@/config";

// The fixture is a Lilongwe forecast and the expectations below (day
// boundaries, "+02:00" offsets, steps per day) are in Malawi time. Pin the
// timezone here so the tests don't depend on whatever the local .env sets
// EXPO_PUBLIC_APP_TIMEZONE to (e.g. a UTC+3 deployment).
jest.mock("@/config", () => ({
  ...jest.requireActual("@/config"),
  APP_TIMEZONE: "Africa/Blantyre",
}));

describe("parseYrForecast", () => {
  const sampleForecast: YrForecast = require("./weatherData.test.json");

  test("get days", () => {
    const record = parseYrForecast(sampleForecast);
    expect(record.days.length).toBe(10);
    expect(record.days[0].day).toBe("2024-01-11T00:00:00.000+02:00");
    expect(record.days[1].day).toBe("2024-01-12T00:00:00.000+02:00");
    expect(record.days[9].day).toBe("2024-01-20T00:00:00.000+02:00");
  });

  test("extract day summary", () => {
    const record = parseYrForecast(sampleForecast);
    const day = record.days[1];
    expect(day.day).toBe("2024-01-12T00:00:00.000+02:00");
    expect(day.minTemperature).toBe(18.7);
    expect(day.maxTemperature).toBe(26.9);
    expect(day.weatherSymbol).toBe("rain");
    expect(day.windSpeed).toBe(4.2); // canonical m/s, as the fixture declares
    expect(day.steps.length).toBe(24);
  });

  test("step fields are pre-computed plain values", () => {
    const record = parseYrForecast(sampleForecast);
    const step = record.days[1].steps[0];
    expect(typeof step.time).toBe("string");
    expect(DateTime.fromISO(step.time).setZone(APP_TIMEZONE).toISO()).toBe(
      "2024-01-12T00:00:00.000+02:00"
    );
    expect(typeof step.weatherSymbol).toBe("string");
    expect(step.weatherSymbol).not.toBe("??");
  });

  test("last day has a weather symbol", () => {
    const record = parseYrForecast(sampleForecast);
    const lastDay = record.days[record.days.length - 1];
    expect(lastDay.weatherSymbol).toBeDefined();
    expect(lastDay.weatherSymbol).not.toBe("snow");
  });

  test("steps filtered by time keep correct count", () => {
    const record = parseYrForecast(sampleForecast);
    const day = record.days[0];
    // day[0] starts at 13:00 local in the test fixture
    expect(day.steps.length).toBe(11);
    expect(DateTime.fromISO(day.steps[0].time).setZone(APP_TIMEZONE).toISO()).toBe(
      "2024-01-11T13:00:00.000+02:00"
    );
  });
});

describe("parseYrForecast units", () => {
  const sampleForecast: YrForecast = require("./weatherData.test.json");

  // Same fixture with values rewritten into other units and meta.units
  // declaring them — parsing must land on the same canonical values.
  function inOtherUnits(raw: YrForecast): YrForecast {
    const copy: YrForecast = JSON.parse(JSON.stringify(raw));
    copy.properties.meta.units = {
      ...copy.properties.meta.units,
      air_temperature: "fahrenheit",
      wind_speed: "knots",
      precipitation_amount: "in",
    };
    for (const step of copy.properties.timeseries) {
      const d = step.data.instant.details;
      if (d.air_temperature !== undefined) d.air_temperature = d.air_temperature * 9 / 5 + 32;
      if (d.wind_speed !== undefined) d.wind_speed = d.wind_speed / 0.514444;
      for (const period of [step.data.next_1_hours, step.data.next_6_hours]) {
        if (period?.details?.precipitation_amount !== undefined) {
          period.details.precipitation_amount = period.details.precipitation_amount / 25.4;
        }
      }
    }
    return copy;
  }

  test("values are normalised to °C, m/s and mm using meta.units", () => {
    const base = parseYrForecast(sampleForecast);
    const converted = parseYrForecast(inOtherUnits(sampleForecast));

    const baseDay = base.days[1];
    const day = converted.days[1];
    expect(day.maxTemperature).toBeCloseTo(baseDay.maxTemperature!);
    expect(day.minTemperature).toBeCloseTo(baseDay.minTemperature!);
    expect(day.windSpeed).toBeCloseTo(baseDay.windSpeed!);

    day.steps.forEach((step, i) => {
      const baseStep = baseDay.steps[i];
      expect(step.temperature).toBeCloseTo(baseStep.temperature!);
      expect(step.windSpeed).toBeCloseTo(baseStep.windSpeed!);
      if (typeof baseStep.precipitation === "number") {
        expect(step.precipitation as number).toBeCloseTo(baseStep.precipitation);
      } else {
        expect(step.precipitation).toBe("-");
      }
    });
  });
});
