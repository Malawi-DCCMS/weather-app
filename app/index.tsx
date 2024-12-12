import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DateTime } from "luxon";
import { ActivityIndicator, Button } from 'react-native-paper';
import { CommonActions } from '@react-navigation/native';
import { useRouter, useNavigation } from 'expo-router';
import { isUndefined } from 'lodash';

import AppBar from '@/components/AppBar';
import Today from '@/components/Today';
import FiveDays from '@/components/FiveDays';
import Alerts from '@/components/Alerts';

import type { AppDispatch, RootState } from '@/lib/store'
import { SCREENS } from '@/lib/layout/constants';
import { getPreciseLocation, saveLocation } from '@/lib/store/location.slice';
import { getLocationForecast, setForecast, setForecastLoading } from '@/lib/store/forecast.slice';
import { getAlerts, setAlertsLoading } from '@/lib/store/alert.slice';
import { WeatherData } from '@/lib/forecast/weatherData';

const appBackground = require('@/assets/new-glass-bg.png');

const MainScreen = () => {
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { name: location, lat, lon, loading: locationLoading, error: locationError } = useSelector((state: RootState) => state.location);
  let { loading, forecast, error: forecastError } = useSelector((state: RootState) => state.forecast);
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    if (isUndefined(lat) || isUndefined(lon)) {
      return;
    }

    setRefreshing(true);
    dispatch(getLocationForecast({ lat, lon }));
    dispatch(getAlerts());
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const onTryAgain = () => {
    if (isUndefined(lat) || isUndefined(lon)) {
      return;
    }

    dispatch(setForecastLoading());
    dispatch(setAlertsLoading());

    dispatch(getAlerts());
    dispatch(getLocationForecast({ lat, lon }));
  }

  // Get GPS location after first(empty)render.
  useEffect(() => {
    (!lat || !lon) && dispatch(getPreciseLocation());
  }, []);

  // Update forecast and alerts each time lat/lon changes.
  // Also update timer for refreshing forecast specified lat/lon regularly.
  useEffect(() => {
    if (typeof lat === 'undefined' ||
      typeof lon === 'undefined') {
      return
    }

    dispatch(saveLocation({ name: location, latitude: lat, longitude: lon }));

    const getReduxAlerts = () => dispatch(getAlerts());
    const getReduxForecast = () => dispatch(getLocationForecast({ lat, lon }));
    setForecast(undefined);

    getReduxForecast();
    getReduxAlerts();

    // Refresh forecast and alerts every hour. Specified in milliseconds.
    const t = setInterval(() => (getReduxForecast(), getReduxAlerts()), 3_600_000);
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

  if (loading || locationLoading) {
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
      router.push({pathname: "/Hourly", params: {
        location: location,
        dayString: today.toISO(),
        startAtCurrentTime: "yes",
        title: 'Hourly Today'
      }})
    const onSelectDay = (location: string) =>
      (day: DateTime) =>
        router.push({pathname: "/Hourly", params: {
          location: location,
          dayString: day.toISO(),
          startAtCurrentTime: "no",
          title: day.toLocaleString({ weekday: 'long' })
        }});

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
          <AppBar location={location} />
          <Alerts lat={lat} lon={lon} location={location} />
          <ScrollView showsVerticalScrollIndicator={false} snapToStart={false} accessible={true} accessibilityLabel='Landing page' refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={'#ffffff'} />
          }>
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
