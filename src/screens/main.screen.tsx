import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';
import { DateTime } from "luxon";

import appBackground from '../../assets/app-bg-normal.png';
import AppBar from '../components/AppBar';
import Today from '../components/Today';
import FiveDays from '../components/FiveDays';
import type { AppDispatch, RootState } from '../store'
import { SCREENS } from '../constants/screens.constant';
import { getPreciseLocation } from '../store/location.slice';
import { getLocationForecast } from '../store/forecast.slice';
import { Forecast } from '../utils/weatherData';

type ScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
}
const MainScreen = ({ navigation }: ScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { name: location, lat, lon, error: locationError } = useSelector((state: RootState) => state.location);
  const { forecast, error: forecastError } = useSelector((state: RootState) => state.forecast);

  useEffect(() => {
    dispatch(getPreciseLocation());
  }, []);

  useEffect(() => {
    dispatch(getLocationForecast({ lat, lon }));
  }, [location]);

  useEffect(() => {
    if (locationError) {
      navigation.navigate(SCREENS.nolocation);
    }
  }, [locationError]);


  if (forecastError) {
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground}>
          <AppBar location={location} navigation={navigation} />
          <Text>There was a problem getting the weather.</Text>
        </ImageBackground>
      </View>
    </SafeAreaView>
  }

  if (forecast) {
    const preparedForecast = new Forecast(forecast)

    const onSelectToday = () =>
      navigation.navigate(SCREENS.hourly, {
        location: location,
        daySummary: preparedForecast.atDay(today),
        title: 'Hourly Today'
      })
    const onSelectDay = (location: string) =>
      (day: DateTime, preparedForecast: Forecast) =>
        navigation.navigate(SCREENS.hourly, {
          location: location,
          daySummary: preparedForecast.atDay(day),
          title: day.toLocaleString({ weekday: 'long' })
        });

    const today = DateTime.now()

    return (
      <SafeAreaView>
        <View style={styles.wrapper}>
          <ImageBackground source={appBackground} style={styles.bg}>
            <AppBar location={location} navigation={navigation} />
            <ScrollView>
              <TouchableOpacity onPress={onSelectToday}>
                <Today daySummary={preparedForecast.atDay(today)} />
              </TouchableOpacity>
              <FiveDays name={location} preparedForecast={preparedForecast} onClick={onSelectDay(location)} />
            </ScrollView>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground}>
          <AppBar location={location} navigation={navigation} />
          <Text>Loading...</Text>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

export default MainScreen;

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
  }
});
