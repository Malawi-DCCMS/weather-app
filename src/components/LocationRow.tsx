import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import moment from 'moment';

import { ForecastTimestep, WeatherForecast } from '../utils/locationforecast';
import { useForecast } from '../hooks/current-forecast.hook';
import { District } from '../constants/districts.constant';
import weatherIcons from '../constants/weathericons.constant';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

function getTodaysTimesteps(forecast: WeatherForecast): Array<ForecastTimestep> {
  const floor = moment(`${moment().subtract(1, 'days').format('YYYY-MM-DD')} 22:00:00`);
  const ceiling = moment(`${moment().format('YYYY-MM-DD')} 21:00:00`);
  return forecast.properties.timeseries.filter(f => moment(f.time).isBetween(floor, ceiling));
}

function sortTimesteps(timesteps: Array<ForecastTimestep>): Array<ForecastTimestep> {
  return timesteps.sort((first, second) => moment(first.time).isBefore(moment(second.time)) ? -1 : 1);
}

function getForecastSymbol(timesteps: Array<ForecastTimestep>): string | undefined {
  const today = moment().format('YYYY-MM-DD');
  const timeIsBefore4 = moment().isBefore(moment(`${today} 04:00:00Z`));
  const timeIsBetween5and10 = moment().isBetween(moment(`${today} 05:00:00Z`), moment(`${today} 10:00:00Z`));
  const timeIsAfter11 = moment().isSameOrAfter(moment(`${today} 11:00:00Z`));
  let desc = undefined;

  if (timeIsBefore4) {
    const timestep = timesteps.find(t => t.time = `${today} 04:00:00Z`);
    desc = timestep?.data.next_12_hours?.summary?.symbol_code;
  }

  if (timeIsBetween5and10) {
    const timestep = timesteps.find(t => t.time = `${today} 10:00:00Z`);
    desc = timestep?.data.next_6_hours?.summary?.symbol_code;
  }

  if (timeIsAfter11) {
    const timestep = timesteps.find(t => t.time = `${today} 11:00:00Z`);
    desc = timestep?.data.next_1_hours?.summary?.symbol_code;
  }

  return desc;
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
    description: getForecastSymbol(timesteps)
  };
}

type LocationRowProps = {
  district: District;
};
function LocationRow(props: LocationRowProps): JSX.Element {
  const [, forecast, error] = useForecast(props.district.lat, props.district.lon);

  if (error) {
    <View style={styles.wrapper}>
      <Text>Not available...</Text>
    </View>
  }

  if (forecast) {
    const timesteps = sortTimesteps(getTodaysTimesteps(forecast));
    const today = getTodaysForecast(timesteps);

    return (
      <View style={styles.wrapper}>
        <View style={styles.left}>
          <View>
            <Text style={styles.header}>{props.district.name}</Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.small}>&uarr;{Math.round(today.maxTemp)}&deg;  &darr;{Math.round(today.minTemp)}&deg;</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Icon source={weatherIcons[getForecastSymbol(timesteps) || 'fair_day']} size={60} />
        </View>
      </View>
    );
  }

  return <View style={styles.wrapper}>
    <Text>Loading...</Text>
  </View>;
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    marginTop: 20,
    paddingRight: 17,
    paddingLeft: 17,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#F5F5F0',
    borderRadius: 4,
  },
  left: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontFamily: 'NotoSans-Regular',
  },
  small: {
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
  },
  smallContainer: {
    marginTop: 5,
  }
});

export default LocationRow;
