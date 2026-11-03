import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

import { jsonStorage } from '@/lib/storage';
import { DEFAULT_PRECIPITATION_UNIT, DEFAULT_TEMPERATURE_UNIT, DEFAULT_WIND_UNIT } from '@/config';
import {
  PrecipitationUnit,
  PRECIPITATION_UNITS,
  TemperatureUnit,
  TEMPERATURE_UNITS,
  UnitPrefs,
  WindUnit,
  WIND_UNITS,
} from '@/lib/units';

const UNITS_KEY = 'units-storage';

function pick<T extends string>(value: string, allowed: T[], fallback: T): T {
  return (allowed as string[]).includes(value) ? (value as T) : fallback;
}

// Deployment defaults (config), validated so a typo in an env var can't
// leave the app with a unit it doesn't know how to show.
export const DEFAULT_UNITS: UnitPrefs = {
  temperature: pick(DEFAULT_TEMPERATURE_UNIT, TEMPERATURE_UNITS, 'celsius'),
  wind: pick(DEFAULT_WIND_UNIT, WIND_UNITS, 'kmh'),
  precipitation: pick(DEFAULT_PRECIPITATION_UNIT, PRECIPITATION_UNITS, 'mm'),
};

interface UnitsState extends UnitPrefs {
  setTemperature: (unit: TemperatureUnit) => void;
  setWind: (unit: WindUnit) => void;
  setPrecipitation: (unit: PrecipitationUnit) => void;
}

export const useUnitsStore = create<UnitsState>()(
  persist(
    (set) => ({
      ...DEFAULT_UNITS,
      setTemperature: (temperature) => set({ temperature }),
      setWind: (wind) => set({ wind }),
      setPrecipitation: (precipitation) => set({ precipitation }),
    }),
    {
      name: UNITS_KEY,
      storage: createJSONStorage(() => jsonStorage),
      // Only the choices are persisted; ignore anything stored that isn't a
      // known unit (e.g. an option removed in a later version).
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<UnitPrefs>;
        return {
          ...current,
          temperature: pick(p.temperature ?? '', TEMPERATURE_UNITS, current.temperature),
          wind: pick(p.wind ?? '', WIND_UNITS, current.wind),
          precipitation: pick(p.precipitation ?? '', PRECIPITATION_UNITS, current.precipitation),
        };
      },
    }
  )
);
