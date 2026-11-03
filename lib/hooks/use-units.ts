import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { useUnitsStore } from '@/lib/store/units-store';
import {
  formatPrecipitation,
  formatTemperature,
  formatWind,
  roundTemperature,
} from '@/lib/units';

// The user's chosen display units plus formatters bound to them. Forecast
// values passed in are always canonical (°C, m/s, mm — see lib/units).
//
//   const units = useUnits();
//   units.temp(24.3)        // "24°C" (or "76°F" in Fahrenheit)
//   units.tempValue(24.3)   // 24     (number, for custom layouts)
//   units.tempSpoken(24.3)  // "24 degrees Celsius" (screen readers)
//   units.wind(6.1)         // "22 km/h"
//   units.rain(1.24)        // "1.2 mm"
export function useUnits() {
  const { t } = useTranslation();
  const temperature = useUnitsStore(s => s.temperature);
  const wind = useUnitsStore(s => s.wind);
  const precipitation = useUnitsStore(s => s.precipitation);

  return useMemo(() => ({
    prefs: { temperature, wind, precipitation },
    temp: (celsius: number | undefined) => formatTemperature(celsius, temperature),
    tempValue: (celsius: number) => roundTemperature(celsius, temperature),
    tempSpoken: (celsius: number) =>
      t(`units.spoken.${temperature}`, { value: roundTemperature(celsius, temperature) }),
    wind: (metresPerSecond: number | undefined) => formatWind(metresPerSecond, wind),
    rain: (millimetres: number) => formatPrecipitation(millimetres, precipitation),
  }), [t, temperature, wind, precipitation]);
}
