import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { DateTime } from "luxon";
import { IconButton } from 'react-native-paper';
import appBackground from '../../assets/appbackground.png';
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
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'Home'>;
const MainScreen = ({ navigation }: ScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { name: location, lat, lon, error: locationError } = useSelector((state: RootState) => state.location);
  const { forecast, error: forecastError } = useSelector((state: RootState) => state.forecast);

  useEffect(() => {
    dispatch(getPreciseLocation());
  }, []);

  useEffect(() => {
    const getForecast = async () => {
      dispatch(getLocationForecast({ lat, lon }));
    };

    getForecast()
    /** Refresh forecast every 6 hours. Specified in milliseconds.  */
    const t = setInterval(getForecast, 21600000);
    return () => clearInterval(t);
  }, [location]);

  useEffect(() => {
    if (locationError) {
      navigation.navigate(SCREENS.NoLocation);
    }
  }, [locationError]);

  if (forecast) {
    const preparedForecast = new Forecast(forecast)

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

    const today = DateTime.now()

    return (
      <SafeAreaView>
        <View style={styles.wrapper}>
          <ImageBackground style={styles.bg} source={appBackground}>
            <AppBar location={location} navigation={navigation} />
            <ScrollView>
              <GlassView glassStyle={styles.glassWrapper} blurStyle={{ blurAmount: 20, blurType: 'light' }}>
                <View style={styles.opacity}>
                  <TouchableOpacity onPress={onSelectToday}>
                    <Today daySummary={preparedForecast.atDay(today)} />
                  </TouchableOpacity>
                  <FiveDays name={location} startDate={today.plus({days:1})} preparedForecast={preparedForecast} onClick={onSelectDay(location)} />
                </View>
              </GlassView>
              {/* { testErr && <ErrorNotification message="Forecast update failed." onClose={() => setTestErr(false)}/>} */}
            </ScrollView>
          </ImageBackground>
        </View>
      </SafeAreaView>
    );
  }

  if (forecastError){
    return (
      <SafeAreaView>
        <View style={styles.wrapper}>
          <ImageBackground source={appBackground} style={styles.bg}>
            <AppBar location={location} navigation={navigation} />
            <Text>There was a problem getting the forecast.</Text>
          </ImageBackground>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={location} navigation={navigation} />
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

type ErrorNotificationProps = {
  message: string,
  onClose: () => void,
}
const ErrorNotification = ({ message, onClose }: ErrorNotificationProps) => {
  return (
    <View style={styles.error}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <IconButton icon="information-outline" iconColor="white" size={24} onPress={onClose} />
        <Text style={styles.errorText}>{message}</Text>
      </View>
      <View>
        <IconButton icon="close" iconColor="white" size={12} onPress={onClose} />
      </View>
    </View>
  );
};

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
    backgroundColor: 'rgba(125, 125, 125, .10)',
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
  }
});
