import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
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
  const { location, forecast, dayString, noValuesBefore, title } = route.params;

  const { alerts } = useSelector((state: RootState) => state.alerts);
  const { lat, lon } = useSelector((state: RootState) => state.location);

  let daySummary:WeatherDataDaySummary| undefined = undefined
  if (forecast && dayString){
    const day = DateTime.fromISO(dayString)
    daySummary = new WeatherData(forecast).atDay(day, noValuesBefore)
  }

  // empty page as default content
  let mainContent: React.JSX.Element = (
    <View style={styles.wrapper}>
    </View>
  )
  if (daySummary){
    mainContent = (
      <HourlyTable daySummary={daySummary} day={daySummary.day} title={title} />
    )
  } else {
    mainContent = (
      <Text style={{ color: 'white', fontSize: 16, padding: 40 }}>Something unforseen has happened and the forecast table can not be presented. Go back and please try again later!</Text>
    )
  }

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={location} navigation={navigation} />
          <Alerts lat={lat} lon={lon} location={location} navigator={navigation} />
          {mainContent}
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
