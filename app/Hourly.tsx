import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTime } from "luxon";
import { shallowEqual, useSelector } from 'react-redux';
import { useLocalSearchParams } from 'expo-router';

import AppBar from '@/components/AppBar';
import HourlyTable from '@/components/HourlyTable';
import Alerts from '@/components/Alerts';

import { RootState } from '@/lib/store';
import { WeatherData, WeatherDataDaySummary } from '@/lib/forecast/weatherData';

const appBackground = require('@/assets/new-glass-bg.png');

function HourlyScreen(): JSX.Element {
  const { location: location_name, dayString, startAtCurrentTime, title } = 
          useLocalSearchParams<{location: string, dayString: string, startAtCurrentTime: string, title: string}>()

  const { name: store_location_name, lat, lon } = useSelector((state: RootState) => state.location, shallowEqual);
  const { forecast } = useSelector((state: RootState) => state.forecast, shallowEqual);

  let daySummary:WeatherDataDaySummary| undefined = undefined
  // Make sure the stored forecast is for the same location as specified through params. This should always be the case.
  if (forecast && dayString &&
    location_name === store_location_name){
    const day = DateTime.fromISO(dayString)
    daySummary = new WeatherData(forecast).atDay(day, startAtCurrentTime === "yes"? true: false)
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
          <AppBar location={location_name} />
          <Alerts lat={lat} lon={lon} location={location_name} />
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

export default HourlyScreen;
