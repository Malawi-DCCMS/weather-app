import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DateTime } from "luxon";
import { ActivityIndicator, Button } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';

import appBackground from '../../assets/new-glass-bg.png';
import AppBar from '../components/AppBar';
import Today from '../components/Today';
import FiveDays from '../components/FiveDays';
import type { AppDispatch, RootState } from '../store'
import { SCREENS } from '../constants/screens.constant';
import { getPreciseLocation, saveLocation } from '../store/location.slice';
import { getLocationForecast, setForecast, setForecastLoading } from '../store/forecast.slice';
import { getLocationAlerts, setAlertsLoading } from '../store/alert.slice';
import { WeatherData } from '../utils/weatherData';
import { RootDrawerParamList } from '../common';
import Alerts from '../components/Alerts';


type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'Home'>;
const MainScreen = ({ navigation }: ScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { name: location, lat, lon, error: locationError } = useSelector((state: RootState) => state.location);
  const { alerts } = useSelector((state: RootState) => state.alerts);
  let { loading, forecast, error: forecastError } = useSelector((state: RootState) => state.forecast);

  const onTryAgain = () => {
    if (typeof lat === 'undefined' ||
        typeof lon === 'undefined'){
      return
    }

    dispatch(setForecastLoading());
    dispatch(setAlertsLoading());

    dispatch(getLocationAlerts({ lat, lon }));
    dispatch(getLocationForecast({ lat, lon }));
  }

  // Get GPS location after first(empty)render.
  useEffect(() => {
    dispatch(getPreciseLocation());
  }, []);

  // Update forecast and alerts each time lat/lon changes.
  // Also update timer for refreshing forecast specified lat/lon regularly.
  useEffect(() => {
    if (typeof lat === 'undefined' ||
        typeof lon === 'undefined'){
      return
    }

    dispatch(saveLocation({ name: location, position: { lat, long: lon } }));

    const getAlerts = () => dispatch(getLocationAlerts({ lat, lon }));
    const getForecast = () => dispatch(getLocationForecast({ lat, lon }));
    setForecast(undefined);

    getForecast();
    getAlerts();

    // Refresh forecast every 6 hours. Specified in milliseconds.
    const t = setInterval(getForecast, 21600000);
    return () => { clearInterval(t); };
  }, [lat, lon]);

  // Reset navigation and go to list of cities if GPS location results in locationError.
  useEffect(() => {
    if (locationError && !navigation.canGoBack()) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: SCREENS.NoLocation }],
        })
      );
    }
  }, [locationError]);

  // empty page as default content
  let mainContent: React.JSX.Element = (
    <View style={styles.opacity}>
    </View>
  )

  if (loading) {
    mainContent = (
      <View style={styles.opacity}>
        <TouchableOpacity onPress={() => { }}>
          <View style={styles.loader}>
            <ActivityIndicator animating={true} color={'white'} size={34} />
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  if (forecast) {
    const preparedForecast = new WeatherData(forecast)
    const today = DateTime.now()

    const onSelectToday = () =>
      navigation.navigate(SCREENS.Hourly, {
        location: location,
        forecast: forecast,
        dayString: today.toISO(),
        noValuesBefore: true,
        title: 'Hourly Today'
      })
    const onSelectDay = (location: string) =>
      (day: DateTime) =>
        navigation.navigate(SCREENS.Hourly, {
          location: location,
          forecast: forecast,
          dayString: day.toISO(),
          noValuesBefore: false,
          title: day.toLocaleString({ weekday: 'long' })
        });

    mainContent = (
      <View style={styles.opacity}>
        <TouchableOpacity onPress={onSelectToday}>
          <Today daySummary={preparedForecast.atDay(today)} />
        </TouchableOpacity>
        <FiveDays name={location} startDate={today.plus({ days: 1 })} preparedForecast={preparedForecast} onClick={onSelectDay(location)} />
      </View>
    )
  }

  if (forecastError) {
    mainContent = (
      <View style={styles.opacity}>
        <View style={styles.errorLoader}>
          <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', padding: 10 }}>{forecastError}</Text>
          <Button onPress={() => onTryAgain()} style={styles.sendButton} textColor='white'><Text style={styles.buttonText}>Try again</Text></Button>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground style={styles.bg} source={appBackground}>
          <AppBar location={location} navigation={navigation} />
          <Alerts alerts={alerts[`${lat}${lon}`]} location={location} navigator={navigation} />
          <ScrollView showsVerticalScrollIndicator={false} snapToStart={false}>
            <View style={styles.glassWrapper}>
              {mainContent}
            </View>
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
  blurCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  opacity: {
    backgroundColor: 'rgba(100, 100, 100, .1)',
  },
  error: {
    backgroundColor: '#BFBFBF',
    flexDirection: 'row',
    marginRight: 19,
    marginLeft: 19,
    marginTop: -45,
    marginBottom: 5,
    gap: 20,
    justifyContent: 'space-between',
  },
  errorText: {
    color: 'white',
    fontSize: 16,
  },
  loader: {
    marginTop: 80,
    marginBottom: 80,
  },
  errorLoader: {
    marginTop: 80,
    marginBottom: 80,
    textAlign: 'center',
    alignItems: 'center',
  },
  whiteText: {
    fontSize: 16,
    lineHeight: 21.79,
    fontWeight: '400',
    fontFamily: 'OpenSans',
    textDecorationLine: 'underline',
    color: 'rgba(174, 209, 255, 1)',
    textAlign: 'center',
  },
  sendButton: {
    backgroundColor: 'rgba(71, 85, 105, .5)',
    width: '40%',
    fontFamily: 'OpenSans',
    borderRadius: 4,
    color: 'white',
    padding: 1,
  },
  buttonText: {
    fontSize: 16,
    color: 'white'
  },
});
