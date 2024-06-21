import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DateTime } from "luxon";

import appBackground from '../../assets/new-glass-bg.png';
import AppBar from '../components/AppBar';
import HourlyTable from '../components/HourlyTable';
import { RootDrawerParamList } from '../common';
import Alerts from '../components/Alerts';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { WeatherData, WeatherDataDaySummary } from '../utils/weatherData';

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'Hourly'>;
function HourScreen({ route, navigation }: ScreenProps): JSX.Element {
  const { location, dayString, onlyFuture, title } = route.params;

  const { alerts } = useSelector((state: RootState) => state.alerts);
  const { forecast } = useSelector((state: RootState) => state.forecast);
  const { lat, lon } = useSelector((state: RootState) => state.location);

  let daySummary:WeatherDataDaySummary| undefined = undefined
  if (forecast && dayString){
    const day = DateTime.fromISO(dayString)
    daySummary = new WeatherData(forecast).atDay(day, onlyFuture)
  }

  if (! daySummary){
    return <>
    </>
  }

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={location} navigation={navigation} />
          <Alerts alerts={alerts[`${lat}${lon}`]} location={location} navigator={navigation} />
          <HourlyTable daySummary={daySummary} day={daySummary.day} title={title} />
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
    overflow: 'scroll',
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
