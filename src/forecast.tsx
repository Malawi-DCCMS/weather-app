import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { WeatherForecast, ForecastTimestep } from './locationforecast'
import { WeatherIcon } from './weathericon';

interface ForecastSummaryProps {
  forecast: WeatherForecast | null
  size: number
}

export function ForecastSummary(props: ForecastSummaryProps) {
  if (props.forecast == null) {
    return <Text>no forecast</Text>
  }

  const timestep = props.forecast.properties.timeseries[0]
  let symbol_code = timestep.data.next_12_hours?.summary?.symbol_code

  return <WeatherIcon symbol_code={symbol_code} size={props.size}/>
}

