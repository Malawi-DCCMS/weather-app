import { FORECAST_DESCRIPTIONS } from '../constants/forecast-descriptions.constant';
import moment from 'moment';
import { ForecastTimestep } from './locationforecast';


export function getForecastDescription(key: string): string {
  return FORECAST_DESCRIPTIONS[key];
}

export function getForecastSymbolAtTime(t: moment.Moment, timesteps: Array<ForecastTimestep>): string | undefined {
  const day = t.format('YYYY-MM-DD');

  if (t.isBefore(moment(`${day} 04:00:00Z`))) {
    const timestep = timesteps.find(timestep => timestep.time == `${day}T04:00:00Z`);
    return timestep?.data.next_12_hours?.summary?.symbol_code;
  }
  if (t.isBefore(moment(`${day} 10:00:00Z`))) {
    const timestep = timesteps.find(timestep => timestep.time == `${day}T10:00:00Z`);
    return timestep?.data.next_6_hours?.summary?.symbol_code;
  }

  const timestep = timesteps.find(timestep => timestep.time == t.format('YYYY-MM-DDTHH') + ':00:00Z');
  return timestep?.data.next_1_hours?.summary?.symbol_code;
}
