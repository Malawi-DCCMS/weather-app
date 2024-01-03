import { FORECAST_DESCRIPTIONS } from '../constants/forecast-descriptions.constant';
import moment from 'moment';
import { ForecastTimestep } from './locationforecast';


export function getForecastDescription(key: string): string {
  return FORECAST_DESCRIPTIONS[key];
}

/**
 * Select a weather symbol to show at a given time. 
 * This is meant to be used to get a single weather symbol to show for today.
 * 
 * @param t The time at which we want to present the weather symbol (typically moment.moment())
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
