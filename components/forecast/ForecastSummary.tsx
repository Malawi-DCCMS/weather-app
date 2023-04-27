import React from 'react';
import {Text} from 'react-native';
import {WeatherForecast} from '../../utils/locationforecast';
import {WeatherIcon} from './WeatherIcon';

interface ForecastSummaryProps {
  forecast: WeatherForecast | undefined;
  size: number;
}

export default function ForecastSummary(props: ForecastSummaryProps) {
  if (props.forecast == null) {
    return <Text>no forecast</Text>;
  }

  const timestep = props.forecast.properties.timeseries[0];
  let symbol_code = timestep.data.next_12_hours?.summary?.symbol_code;

  return <WeatherIcon symbol_code={symbol_code} size={props.size} />;
}
