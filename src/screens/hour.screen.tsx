import React from 'react';
import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';
import moment from 'moment';

import { useCurrentPlace } from "../hooks/current-place.hook";
import appBackground from '../../assets/app-bg-faded.png';
import AppBar from '../components/AppBar';
import { useForecast } from '../hooks/current-forecast.hook';
import { ForecastTimestep, WeatherForecast } from '../utils/locationforecast';
import HourlyTable from '../components/HourlyTable';

function getTodaysTimesteps(forecast: WeatherForecast): Array<ForecastTimestep> {
  const floor = moment(`${moment().subtract(1, 'days').format('YYYY-MM-DD')} 22:00:00`);
  const ceiling = moment(`${moment().format('YYYY-MM-DD')} 21:00:00`);
  return forecast.properties.timeseries.filter(f => moment(f.time).isBetween(floor, ceiling));
}


function sortTimesteps(timesteps: Array<ForecastTimestep>): Array<ForecastTimestep> {
  return timesteps.sort((first, second) => moment(first.time).isBefore(moment(second.time)) ? -1 : 1);
}

function HourScreen(): JSX.Element {
  const place = useCurrentPlace();
  const [, forecast, error] = useForecast(place.position.lat, place.position.long);

  if (error) {
    Alert.alert(error.message);
    return <></>;
  }

  if (forecast) {
    const timesteps = getTodaysTimesteps(forecast);
    const sorted = sortTimesteps(timesteps);
    return (
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={place.name} />
          <HourlyTable forecast={sorted} />
        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ImageBackground source={appBackground} style={styles.bg}>
        <View style={styles.container}>
          <Text style={styles.header}>Hourly today</Text>
          <Text>Loading...</Text>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  bg: {
    height: '100%',
  },
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontFamily: 'Rajdhani-Regular',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
  },
});

export default HourScreen;
