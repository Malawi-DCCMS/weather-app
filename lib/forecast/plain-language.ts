// Buckets raw wind/rain measurements into plain-language levels so the UI
// never shows a bare wind or rain figure — every number gets a word next to it.
// Thresholds are simple, UI-facing categories (not a meteorological product),
// tuned for a lake-fishing safety context per DCCMS guidance in the design reference.

export type WindLevel = 'calm' | 'gentle' | 'breezy' | 'strong' | 'severe';
export type RainLevel = 'none' | 'light' | 'moderate' | 'heavy';

// Thresholds were set in km/h (5 / 20 / 35 / 50); wind speeds are now
// canonical m/s, so they're converted here rather than re-picked — the same
// physical wind gets the same word whatever unit the user displays.
const KMH = 1 / 3.6;
const WIND_THRESHOLDS_MS = { calm: 5 * KMH, gentle: 20 * KMH, breezy: 35 * KMH, strong: 50 * KMH };

export function windLevel(windSpeedMs: number | undefined): WindLevel {
  const speed = windSpeedMs ?? 0;
  if (speed < WIND_THRESHOLDS_MS.calm) return 'calm';
  if (speed < WIND_THRESHOLDS_MS.gentle) return 'gentle';
  if (speed < WIND_THRESHOLDS_MS.breezy) return 'breezy';
  if (speed < WIND_THRESHOLDS_MS.strong) return 'strong';
  return 'severe';
}

export function rainLevel(precipitationMm: number | undefined): RainLevel {
  const mm = precipitationMm ?? 0;
  if (mm <= 0) return 'none';
  if (mm < 0.5) return 'light';
  if (mm < 4) return 'moderate';
  return 'heavy';
}

// Short (1-3 word) i18next keys for tight spaces — list rows, table cells.
export const WIND_LEVEL_LABEL_KEYS: Record<WindLevel, string> = {
  calm: 'wind.calm.label',
  gentle: 'wind.gentle.label',
  breezy: 'wind.breezy.label',
  strong: 'wind.strong.label',
  severe: 'wind.severe.label',
};

export const RAIN_LEVEL_LABEL_KEYS: Record<RainLevel, string> = {
  none: 'conditions.rain.none.label',
  light: 'conditions.rain.light.label',
  moderate: 'conditions.rain.moderate.label',
  heavy: 'conditions.rain.heavy.label',
};

// Full-sentence i18next keys with a safety qualifier, for prose contexts
// (Today's daily summary, warnings) — wired up when those screens are built.
export const WIND_LEVEL_SENTENCE_KEYS: Record<WindLevel, string> = {
  calm: 'wind.calm.sentence',
  gentle: 'wind.gentle.sentence',
  breezy: 'wind.breezy.sentence',
  strong: 'wind.strong.sentence',
  severe: 'wind.severe.sentence',
};

export const RAIN_LEVEL_SENTENCE_KEYS: Record<RainLevel, string> = {
  none: 'conditions.rain.none.sentence',
  light: 'conditions.rain.light.sentence',
  moderate: 'conditions.rain.moderate.sentence',
  heavy: 'conditions.rain.heavy.sentence',
};
