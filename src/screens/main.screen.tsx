import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DateTime } from "luxon";

import appBackground from '../../assets/MOBILE-craig-manners-dyWHuFsdfIo-unsplash.png';
import AppBar from '../components/AppBar';
import Today from '../components/Today';
import FiveDays from '../components/FiveDays';
import type { AppDispatch, RootState } from '../store'
import { SCREENS } from '../constants/screens.constant';
import { getPreciseLocation } from '../store/location.slice';
import { getLocationForecast } from '../store/forecast.slice';
import { Forecast } from '../utils/weatherData';
import { RootDrawerParamList } from '../common';
import { GlassView } from '../components/GlassView';

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'Home'>;
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
      navigation.navigate(SCREENS.NoLocation);
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

  if (!forecast) {
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

  const preparedForecast = new Forecast(forecast)
  const today = DateTime.now()
  const todaysForecast = preparedForecast.atDay(today)

  const onSelectToday = () =>
    navigation.navigate(SCREENS.Hourly, {
      location: location,
      daySummary: preparedForecast.atDay(today),
      title: 'Hourly Today'
    })
  const onSelectDay = (location: string) =>
    (day: DateTime, preparedForecast: Forecast) =>
      navigation.navigate(SCREENS.Hourly, {
        location: location,
        daySummary: preparedForecast.atDay(day),
        title: day.toLocaleString({ weekday: 'long' })
      });

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={location} navigation={navigation} />
          <ScrollView>
            <GlassView glassStyle={styles.glassWrapper} blurStyle={{ blurAmount: 8, blurType: 'light' }}>
              <View style={styles.opacity}>
                <TouchableOpacity onPress={onSelectToday}>
                  <Today daySummary={todaysForecast} />
                </TouchableOpacity>
                <FiveDays name={location} startDate={today.plus({ days: 1 })} preparedForecast={preparedForecast} onClick={onSelectDay(location)} />
              </View>
            </GlassView>
          </ScrollView>
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
  },
  glassWrapper: {
    marginRight: 19,
    marginLeft: 19,
    marginTop: 17.88,
    marginBottom: 49.12,
    borderRadius: 8,
    borderStyle: 'solid',
    borderLeftWidth: 1,
    borderBottomWidth: 1,
    borderRightWidth: .5,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, .6)',
  },
  opacity: {
    backgroundColor: 'rgba(0, 0, 0, .3)',
  },
});
