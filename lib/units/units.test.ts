import {
  convertPrecipitation,
  convertTemperature,
  convertWind,
  formatPrecipitation,
  formatTemperature,
  formatWind,
  roundTemperature,
  toCelsius,
  toMetresPerSecond,
  toMillimetres,
} from '.';
import { windLevel } from '@/lib/forecast/plain-language';

describe('normalising API units to canonical', () => {
  test('temperature', () => {
    expect(toCelsius(24, 'celsius')).toBe(24);
    expect(toCelsius(24)).toBe(24);
    expect(toCelsius(212, 'fahrenheit')).toBeCloseTo(100);
    expect(toCelsius(273.15, 'kelvin')).toBeCloseTo(0);
  });

  test('wind speed', () => {
    expect(toMetresPerSecond(5, 'm/s')).toBe(5);
    expect(toMetresPerSecond(36, 'km/h')).toBeCloseTo(10);
    expect(toMetresPerSecond(10, 'knots')).toBeCloseTo(5.14444);
    expect(toMetresPerSecond(10, 'mph')).toBeCloseTo(4.4704);
  });

  test('precipitation', () => {
    expect(toMillimetres(1.2, 'mm')).toBe(1.2);
    expect(toMillimetres(1, 'in')).toBeCloseTo(25.4);
    expect(toMillimetres(1, 'cm')).toBe(10);
  });

  test('unknown units pass through unchanged', () => {
    const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
    expect(toMetresPerSecond(7, 'furlongs/fortnight')).toBe(7);
    expect(warn).toHaveBeenCalledTimes(1);
    warn.mockRestore();
  });
});

describe('converting canonical to display units', () => {
  test('round trips', () => {
    expect(convertTemperature(toCelsius(50, 'fahrenheit'), 'fahrenheit')).toBeCloseTo(50);
    expect(convertWind(toMetresPerSecond(20, 'knots'), 'knots')).toBeCloseTo(20);
    expect(convertWind(toMetresPerSecond(20, 'km/h'), 'kmh')).toBeCloseTo(20);
    expect(convertPrecipitation(toMillimetres(0.5, 'in'), 'in')).toBeCloseTo(0.5);
  });
});

describe('formatting', () => {
  test('temperature', () => {
    expect(formatTemperature(24.3, 'celsius')).toBe('24°C');
    expect(formatTemperature(24.3, 'fahrenheit')).toBe('76°F');
    expect(formatTemperature(undefined, 'celsius')).toBe('');
    expect(roundTemperature(-0.4, 'celsius')).toBe(0);
    expect(Object.is(roundTemperature(-0.4, 'celsius'), -0)).toBe(false);
  });

  test('wind', () => {
    expect(formatWind(6.1, 'kmh')).toBe('22 km/h');
    expect(formatWind(6.1, 'ms')).toBe('6 m/s');
    expect(formatWind(6.1, 'knots')).toBe('12 kn');
    expect(formatWind(6.1, 'mph')).toBe('14 mph');
    expect(formatWind(undefined, 'kmh')).toBe('0 km/h');
  });

  test('precipitation', () => {
    expect(formatPrecipitation(1.24, 'mm')).toBe('1.2 mm');
    expect(formatPrecipitation(12.7, 'in')).toBe('0.50 in');
  });
});

describe('wind level words', () => {
  // Thresholds were 5 / 20 / 35 / 50 km/h; the same physical speeds must
  // still give the same words now speeds are stored in m/s.
  test.each([
    [4.9, 'calm'],
    [5, 'gentle'],
    [19.9, 'gentle'],
    [20, 'breezy'],
    [35, 'strong'],
    [50, 'severe'],
  ])('%p km/h is %p', (kmh, level) => {
    expect(windLevel(toMetresPerSecond(kmh as number, 'km/h'))).toBe(level);
  });
});
