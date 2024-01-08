import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import moment from 'moment';
import { ForecastTimestep, WeatherForecast } from '../utils/locationforecast';
import { getForecastDescription, getForecastSymbolAtTime } from '../utils/forecast.utils';

function getTodaysTimesteps(forecast: WeatherForecast): Array<ForecastTimestep> {
  const floor = moment(`${moment().subtract(1, 'days').format('YYYY-MM-DD')} 22:00:00`);
  const ceiling = moment(`${moment().format('YYYY-MM-DD')} 21:00:00`);
  return forecast.properties.timeseries.filter(f => moment(f.time).isBetween(floor, ceiling));
}

function sortTimesteps(timesteps: Array<ForecastTimestep>): Array<ForecastTimestep> {
  return timesteps.sort((first, second) => moment(first.time).isBefore(moment(second.time)) ? -1 : 1);
}

type TodaysForecast = {
  temp?: number;
  maxTemp: number;
  minTemp: number;
  description?: string
};
function getTodaysForecast(timesteps: Array<ForecastTimestep>): TodaysForecast {
  const temps = timesteps.map(t => t.data.instant.details.air_temperature || 0);
  return {
    temp: timesteps[0].data.instant.details.air_temperature,
    minTemp: Math.min(...temps),
    maxTemp: Math.max(...temps),
    description: getForecastSymbolAtTime(moment(), timesteps)
  };
}

type TodaysForecastProps = {
  forecast: WeatherForecast;
};
function Today(props: TodaysForecastProps): JSX.Element {
  const timesteps = sortTimesteps(getTodaysTimesteps(props.forecast));
  const today = getTodaysForecast(timesteps);

  return (
    <View style={styles.wrapper}>
      <View style={styles.today}>
        <View><Text style={styles.todaysHeader}>Today &gt;</Text></View>
        <View><Text style={styles.large}>{today.temp ? Math.round(today.temp) : 0}&deg;</Text></View>
      </View>
      <View style={styles.temps}>
        <View>
          <Text style={styles.small}>
            &uarr; {Math.round(today.maxTemp)}&deg; &darr; {Math.round(today.minTemp)}&deg;
          </Text>
        </View>
        <View>
          <Text style={styles.small}>
            {today.description ? getForecastDescription(today.description) : 'Not available'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  today: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  temps: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingTop: 35,
    marginLeft: 10,
  },
  todaysHeader: {
    fontSize: 24,
    fontFamily: 'Rajdhani-Regular',
    marginBottom: -15,
    marginLeft: 8,
  },
  large: {
    fontSize: 96,
    fontFamily: 'Rajdhani-Regular',
  },
  small: {
    fontSize: 16,
    fontFamily: 'Rajdhani-Light',
  }
});

export default Today;
