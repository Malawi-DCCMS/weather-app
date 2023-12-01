import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DrawerScreenProps } from '@react-navigation/drawer';

import appBackground from '../../assets/app-bg-faded.png';
import AppBar from '../components/AppBar';
import { ForecastTimestep, WeatherForecast } from '../utils/locationforecast';
import HourlyTable from '../components/HourlyTable';
import { RootDrawerParamList } from '../common';

function getTodaysTimesteps(forecast: WeatherForecast): Array<ForecastTimestep> {
  const floor = moment(`${moment().subtract(1, 'days').format('YYYY-MM-DD')} 22:00:00`);
  const ceiling = moment(`${moment().format('YYYY-MM-DD')} 21:00:00`);
  return forecast.properties.timeseries.filter(f => moment(f.time).isBetween(floor, ceiling));
}

function sortTimesteps(timesteps: Array<ForecastTimestep>): Array<ForecastTimestep> {
  return timesteps.sort((first, second) => moment(first.time).isBefore(moment(second.time)) ? -1 : 1);
}

type ScreenProps = DrawerScreenProps<RootDrawerParamList, 'Hourly'>;
function HourScreen({ route, navigation }: ScreenProps): JSX.Element {
  const { forecast, name } = route.params;
  const timesteps = getTodaysTimesteps(forecast);
  const sorted = sortTimesteps(timesteps);
  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={name} navigation={navigation} />
          <HourlyTable forecast={sorted} />
        </ImageBackground>
      </View>
    </SafeAreaView>
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
