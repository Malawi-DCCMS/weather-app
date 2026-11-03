import { DateTime } from 'luxon';

import { ForecastDayRecord, ForecastRecord, ForecastStepRecord } from './types';
import { rainLevel, windLevel, RAIN_LEVEL_SENTENCE_KEYS } from './plain-language';

export type DayPart = 'morning' | 'afternoon' | 'evening' | 'night';

export const DAY_PARTS: DayPart[] = ['morning', 'afternoon', 'evening', 'night'];

export const DAY_PART_LABEL_KEYS: Record<DayPart, string> = {
  morning: 'time.periods.morning',
  afternoon: 'time.periods.afternoon',
  evening: 'time.periods.evening',
  night: 'time.periods.night',
};

// Maps Luxon weekday numbers (1 = Monday, 7 = Sunday) to translation keys.
export const WEEKDAY_LABEL_KEYS: Record<number, string> = {
  1: 'time.days.mon',
  2: 'time.days.tue',
  3: 'time.days.wed',
  4: 'time.days.thu',
  5: 'time.days.fri',
  6: 'time.days.sat',
  7: 'time.days.sun',
};

const RANGE: Record<DayPart, [number, number]> = {
  morning: [6, 12],
  afternoon: [12, 18],
  evening: [18, 21],
  night: [21, 24],
};

const ANCHOR_HOUR: Record<DayPart, number> = {
  morning: 9,
  afternoon: 15,
  evening: 19,
  night: 23,
};

export type DayPartSummary = {
  temperature?: number;
  weatherSymbol?: string;
  precipitation: number;
};

// Yr's timeseries for "today" starts at the current instant, not midnight, so
// day parts already in the past have no steps — they're simply omitted rather
// than fabricated.
export function getDayParts(daySummary: ForecastDayRecord): Partial<Record<DayPart, DayPartSummary>> {
  const result: Partial<Record<DayPart, DayPartSummary>> = {};

  for (const part of DAY_PARTS) {
    const [start, end] = RANGE[part];
    const stepsInRange = daySummary.steps.filter(s => {
      const hour = DateTime.fromISO(s.time).hour;
      return hour >= start && hour < end;
    });

    if (!stepsInRange.length) continue;

    const anchor = ANCHOR_HOUR[part];
    const closest = stepsInRange.reduce((best, step) =>
      Math.abs(DateTime.fromISO(step.time).hour - anchor) < Math.abs(DateTime.fromISO(best.time).hour - anchor)
        ? step
        : best
    );

    const maxPrecipitation = Math.max(
      0,
      ...stepsInRange.map(s => (typeof s.precipitation === 'number' ? s.precipitation : 0))
    );

    result[part] = {
      temperature: closest.temperature,
      weatherSymbol: closest.weatherSymbol,
      precipitation: maxPrecipitation,
    };
  }

  return result;
}

export type ConditionBucket =
  | 'clear' | 'fair' | 'partlycloudy' | 'cloudy' | 'fog'
  | 'lightrain' | 'rain' | 'heavyrain'
  | 'lightsleet' | 'sleet' | 'heavysleet'
  | 'lightsnow' | 'snow' | 'heavysnow'
  | 'thunder';

export function conditionBucket(weatherSymbol: string | undefined): ConditionBucket {
  const s = weatherSymbol ?? '';
  if (s.includes('thunder')) return 'thunder';
  if (s.includes('heavysnow')) return 'heavysnow';
  if (s.includes('lightsnow')) return 'lightsnow';
  if (s.includes('snow')) return 'snow';
  if (s.includes('heavysleet')) return 'heavysleet';
  if (s.includes('lightsleet')) return 'lightsleet';
  if (s.includes('sleet')) return 'sleet';
  if (s.includes('heavyrain')) return 'heavyrain';
  if (s.includes('lightrain')) return 'lightrain';
  if (s.includes('rain')) return 'rain';
  if (s.includes('fog')) return 'fog';
  if (s.includes('partlycloudy')) return 'partlycloudy';
  if (s.includes('cloudy')) return 'cloudy';
  if (s.includes('fair')) return 'fair';
  if (s.includes('clearsky')) return 'clear';
  return 'cloudy';
}

export const CONDITION_LABEL_KEYS: Record<ConditionBucket, string> = {
  clear: 'condition.clear',
  fair: 'condition.fair',
  partlycloudy: 'condition.partlycloudy',
  cloudy: 'condition.cloudy',
  fog: 'condition.fog',
  lightrain: 'condition.lightrain',
  rain: 'condition.rain',
  heavyrain: 'condition.heavyrain',
  lightsleet: 'condition.lightsleet',
  sleet: 'condition.sleet',
  heavysleet: 'condition.heavysleet',
  lightsnow: 'condition.lightsnow',
  snow: 'condition.snow',
  heavysnow: 'condition.heavysnow',
  thunder: 'condition.thunder',
};

export type TodaySummaryParts = {
  lead: string;
  predictive?: string;
  trailing?: string;
};

type Translate = (key: string, options?: Record<string, unknown>) => string;

// Builds the one-sentence plain-language summary shown under Today's current
// conditions: a factual lead clause, an optional predictive rain-trend clause
// (bolded by the caller), and an optional cooler-tonight clause.
export function buildTodaySummary(
  t: Translate,
  location: string,
  nowStep: ForecastStepRecord | undefined,
  dayParts: Partial<Record<DayPart, DayPartSummary>>,
  // Converts a °C value to the user's display unit (rounded); the 2-degree
  // "cooler" threshold below stays in °C so it's the same real difference.
  formatDisplayTemp: (celsius: number) => string | number = (c) => `${Math.round(c)}°C`
): TodaySummaryParts {
  const nowCondition = t(CONDITION_LABEL_KEYS[conditionBucket(nowStep?.weatherSymbol)]);
  const lead = t('summary.lead', { condition: nowCondition, location });

  const nowPrecip = typeof nowStep?.precipitation === 'number' ? nowStep.precipitation : 0;
  const nowRain = rainLevel(nowPrecip);
  const rainRank = { none: 0, light: 1, moderate: 2, heavy: 3 };

  const nowHour = nowStep ? DateTime.fromISO(nowStep.time).hour : DateTime.now().hour;
  const upcomingPart = DAY_PARTS.find(part => {
    const summary = dayParts[part];
    if (!summary) return false;
    return ANCHOR_HOUR[part] > nowHour;
  });

  let predictive: string | undefined;
  if (upcomingPart) {
    const upcomingSummary = dayParts[upcomingPart]!;
    const upcomingRain = rainLevel(upcomingSummary.precipitation);
    const partLabel = t(`daypart.${upcomingPart}`);

    if (rainRank[upcomingRain] > rainRank[nowRain]) {
      predictive = t('summary.morerain', { part: partLabel });
    } else if (rainRank[upcomingRain] < rainRank[nowRain]) {
      predictive = t('summary.raineasing', { part: partLabel });
    }
  }

  let trailing: string | undefined;
  const night = dayParts.night;
  if (
    night?.temperature !== undefined &&
    nowStep?.temperature !== undefined &&
    nowStep.temperature - night.temperature >= 2
  ) {
    trailing = t('summary.coolertonight', { temp: formatDisplayTemp(night.temperature) });
  }

  return { lead, predictive, trailing };
}

// Condition buckets that already say "rain" (or worse) on their own — a
// day-summary sentence for these shouldn't also append a separate rain
// clause, since that would just repeat itself.
const RAIN_FAMILY: ConditionBucket[] = [
  'lightrain', 'rain', 'heavyrain', 'thunder',
  'lightsleet', 'sleet', 'heavysleet',
  'lightsnow', 'snow', 'heavysnow',
];

export function dayRainLevel(daySummary: ForecastDayRecord) {
  const maxPrecipitation = Math.max(
    0,
    ...daySummary.steps.map(s => (typeof s.precipitation === 'number' ? s.precipitation : 0))
  );
  return rainLevel(maxPrecipitation);
}

// One-sentence plain-language description of a whole day, for the 5-day
// list ("Cloudy. Light rain expected." / "Cloudy and very windy.").
export function describeDaySummary(t: Translate, daySummary: ForecastDayRecord): string {
  const bucket = conditionBucket(daySummary.weatherSymbol);
  const condition = t(CONDITION_LABEL_KEYS[bucket]);
  const isWindy = ['breezy', 'strong', 'severe'].includes(windLevel(daySummary.windSpeed));

  const lead = isWindy ? t('day.conditionWindy', { condition }) : `${condition}.`;

  if (RAIN_FAMILY.includes(bucket)) {
    return lead;
  }

  const rainSentence = t(RAIN_LEVEL_SENTENCE_KEYS[dayRainLevel(daySummary)]);
  return `${lead} ${rainSentence}`;
}

// Slices a forecast to the 5-day window starting at startDate (inclusive),
// shared by the FiveDays list and the Today screen's summary card.
export function getFiveDayWindow(forecast: ForecastRecord, startDate: DateTime): ForecastDayRecord[] {
  const startIndex = forecast.days.findIndex(d => DateTime.fromISO(d.day).hasSame(startDate, 'day'));
  if (startIndex === -1) return [];
  return forecast.days.slice(startIndex, startIndex + 5);
}
