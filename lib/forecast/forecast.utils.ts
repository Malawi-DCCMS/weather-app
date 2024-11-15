import moment from 'moment';

import { FORECAST_DESCRIPTIONS } from '@/lib/forecast/forecast-descriptions.constant';
import { ForecastTimestep } from '@/lib/forecast/types';


export function getForecastDescription(key: string): string {
  return FORECAST_DESCRIPTIONS[key];
}

/**
 * Select a weather symbol to show at a given time. 
 * This is meant to be used to get a single weather symbol to show for today.
 * 
 * * Before 06 local time: 12h symbol valid 06-18 
 * * Between 06 and 12 local time: 6h symbol valid 12-18 
 * * After 12 local time: 1h symbol valid from the first time step 
 * 
 * @param t The time at which we want to present the weather symbol (typically moment())
 * @param timesteps The forecast timesteps
 * @returns A weather symobl text, or undefined if unable to find a symbol to show.
 */
export function getForecastSymbolAtTime(t: moment.Moment, timesteps: Array<ForecastTimestep>): string | undefined {
  const today = t.format('YYYY-MM-DD');

  if (t.isBefore(moment(`${today} 04:00:00Z`))) {
    const timestep = timesteps.find(timestep => timestep.time == `${today}T04:00:00Z`);
    return timestep?.data.next_12_hours?.summary?.symbol_code;
  }
  if (t.isBefore(moment(`${today} 10:00:00Z`))) {
    const timestep = timesteps.find(timestep => timestep.time == `${today}T10:00:00Z`);
    return timestep?.data.next_6_hours?.summary?.symbol_code;
  }

  const timestep = timesteps.find(timestep => timestep.time == t.format('YYYY-MM-DDTHH') + ':00:00Z');
  return timestep?.data.next_1_hours?.summary?.symbol_code;
}

/**
 * Get a weather symbol representing an entire day.
 * 
 * * 12h symbol valid 06-18 or 08-20 local time, if not available use the ones below:
 * * 6h symbol valid 08-14 or 14-20 local time
 * * 1h symbol valid 14 local time
 * 
 * Note that for now, we ignore local time - we just use directly utc time. 
 * This is because the delivered forecast has a better chance of having a valid 12. or 6-hour symbol at utc hours divisible by 6.
 * 
 * @param timesteps All available timesteps for a single day. 
 * @returns A weather icon representing the weather for this particular day, or undefined if unable to determine the weather symbol.
 */
export function getWeatherIconAtDay(timesteps: Array<ForecastTimestep>): string | undefined {
  const wantedTimestep = timesteps[0].time.substring(0, 10) + "T06:00:00Z";
  const timestep = timesteps.find(timestep => timestep.time == wantedTimestep);
  let symbol = timestep?.data.next_12_hours?.summary?.symbol_code;

  if (symbol === undefined) {
    symbol = timestep?.data.next_6_hours?.summary?.symbol_code;
  }
  if (symbol === undefined) {
    const wantedTimestep = timesteps[0].time.substring(0, 10) + "T12:00:00Z";
    const timestep = timesteps.find(timestep => timestep.time == wantedTimestep);
    symbol = timestep?.data.next_6_hours?.summary?.symbol_code;
    if (symbol === undefined) {
      symbol = timestep?.data.next_1_hours?.summary?.symbol_code;
    }
  }

  return symbol
}
