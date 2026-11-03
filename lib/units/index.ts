// Unit handling for forecast values.
//
// The app keeps every forecast value in ONE canonical unit internally —
// °C for temperature, m/s for wind speed, mm for precipitation — whatever
// the API sent (providers normalise using the response's declared units,
// see toCelsius/toMetresPerSecond/toMillimetres) and whatever the user
// chose to see (screens convert at display time via useUnits()). Cached
// forecasts are therefore independent of the user's unit choice, and
// switching units never needs a refetch.

export type TemperatureUnit = 'celsius' | 'fahrenheit';
export type WindUnit = 'kmh' | 'ms' | 'knots' | 'mph';
export type PrecipitationUnit = 'mm' | 'in';

export type UnitPrefs = {
  temperature: TemperatureUnit;
  wind: WindUnit;
  precipitation: PrecipitationUnit;
};

export const TEMPERATURE_UNITS: TemperatureUnit[] = ['celsius', 'fahrenheit'];
export const WIND_UNITS: WindUnit[] = ['kmh', 'ms', 'knots', 'mph'];
export const PRECIPITATION_UNITS: PrecipitationUnit[] = ['mm', 'in'];

// International symbols — the same in every supported language, so these
// aren't translated. Full names for the Settings picker are i18n keys
// (`units.<unit>`).
export const TEMPERATURE_SYMBOLS: Record<TemperatureUnit, string> = { celsius: '°C', fahrenheit: '°F' };
export const WIND_SYMBOLS: Record<WindUnit, string> = { kmh: 'km/h', ms: 'm/s', knots: 'kn', mph: 'mph' };
export const PRECIPITATION_SYMBOLS: Record<PrecipitationUnit, string> = { mm: 'mm', in: 'in' };

const MS_PER_KMH = 1 / 3.6;
const MS_PER_KNOT = 0.514444;
const MS_PER_MPH = 0.44704;
const MM_PER_INCH = 25.4;

// --- API units -> canonical ------------------------------------------------
// `unit` is the string from the response's meta.units (e.g. MET Norway's
// "celsius", "m/s", "mm"). Missing means canonical. An unrecognised unit is
// passed through unchanged with a warning rather than guessed at.

const warned = new Set<string>();
function unknownUnit(quantity: string, unit: string): void {
  const key = `${quantity}:${unit}`;
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`Unrecognised ${quantity} unit "${unit}" in forecast response; using values as-is.`);
}

export function toCelsius(value: number, unit?: string): number {
  switch (unit?.trim().toLowerCase()) {
    case undefined:
    case 'celsius':
    case 'c':
    case '°c':
      return value;
    case 'fahrenheit':
    case 'f':
    case '°f':
      return (value - 32) * 5 / 9;
    case 'kelvin':
    case 'k':
      return value - 273.15;
    default:
      unknownUnit('temperature', unit!);
      return value;
  }
}

export function toMetresPerSecond(value: number, unit?: string): number {
  switch (unit?.trim().toLowerCase()) {
    case undefined:
    case 'm/s':
    case 'ms':
    case 'mps':
      return value;
    case 'km/h':
    case 'kmh':
    case 'kph':
      return value * MS_PER_KMH;
    case 'knots':
    case 'knot':
    case 'kn':
    case 'kt':
      return value * MS_PER_KNOT;
    case 'mph':
      return value * MS_PER_MPH;
    default:
      unknownUnit('wind speed', unit!);
      return value;
  }
}

export function toMillimetres(value: number, unit?: string): number {
  switch (unit?.trim().toLowerCase()) {
    case undefined:
    case 'mm':
      return value;
    case 'cm':
      return value * 10;
    case 'in':
    case 'inch':
    case 'inches':
      return value * MM_PER_INCH;
    default:
      unknownUnit('precipitation', unit!);
      return value;
  }
}

// --- canonical -> display unit --------------------------------------------

export function convertTemperature(celsius: number, unit: TemperatureUnit): number {
  return unit === 'fahrenheit' ? celsius * 9 / 5 + 32 : celsius;
}

export function convertWind(metresPerSecond: number, unit: WindUnit): number {
  switch (unit) {
    case 'kmh': return metresPerSecond / MS_PER_KMH;
    case 'knots': return metresPerSecond / MS_PER_KNOT;
    case 'mph': return metresPerSecond / MS_PER_MPH;
    case 'ms': return metresPerSecond;
  }
}

export function convertPrecipitation(millimetres: number, unit: PrecipitationUnit): number {
  return unit === 'in' ? millimetres / MM_PER_INCH : millimetres;
}

// --- formatting -------------------------------------------------------------
// Rounding lives here so every screen shows the same figure for the same
// value: whole degrees and whole wind units; 1 decimal for mm, 2 for inches.

export function roundTemperature(celsius: number, unit: TemperatureUnit): number {
  // `|| 0` turns -0 (e.g. -0.4°C) into a plain 0.
  return Math.round(convertTemperature(celsius, unit)) || 0;
}

export function formatTemperature(celsius: number | undefined, unit: TemperatureUnit): string {
  return celsius === undefined ? '' : `${roundTemperature(celsius, unit)}${TEMPERATURE_SYMBOLS[unit]}`;
}

export function formatWind(metresPerSecond: number | undefined, unit: WindUnit): string {
  const value = Math.round(convertWind(metresPerSecond ?? 0, unit)) || 0;
  return `${value} ${WIND_SYMBOLS[unit]}`;
}

export function formatPrecipitation(millimetres: number, unit: PrecipitationUnit): string {
  const decimals = unit === 'in' ? 2 : 1;
  return `${convertPrecipitation(millimetres, unit).toFixed(decimals)} ${PRECIPITATION_SYMBOLS[unit]}`;
}
