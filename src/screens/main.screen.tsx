import React, { useEffect } from 'react';
import { ImageBackground, StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ParamListBase } from '@react-navigation/native';

import appBackground from '../../assets/app-bg-normal.png';
import AppBar from '../components/AppBar';
import Today from '../components/Today';
import FiveDays from '../components/FiveDays';
import type { AppDispatch, RootState } from '../store'
import { SCREENS } from '../constants/screens.constant';
import { getPreciseLocation } from '../store/location.slice';
import { getLocationForecast } from '../store/forecast.slice';

type ScreenProps = {
  navigation: NativeStackNavigationProp<ParamListBase>;
}
const MainScreen = ({ navigation }: ScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { name, lat, lon, error: locationError } = useSelector((state: RootState) => state.location);
  const { forecast, error: forecastError } = useSelector((state: RootState) => state.forecast);

  useEffect(() => {
    dispatch(getPreciseLocation());
  }, []);

  useEffect(() => {
    dispatch(getLocationForecast({ lat, lon }));
  }, [name]);

  useEffect(() => {
    if (locationError) {
      navigation.navigate(SCREENS.nolocation);
    }
  }, [locationError]);

  if (forecastError) {
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground}>
          <AppBar location={name} navigation={navigation} />
          <Text>There was a problem getting the weather.</Text>
        </ImageBackground>
      </View>
    </SafeAreaView>
  }

  if (forecast) {
    return (
      <SafeAreaView>
        <View style={styles.wrapper}>
          <ImageBackground source={appBackground} style={styles.bg}>
            <AppBar location={name} navigation={navigation} />
            <ScrollView>
              <TouchableOpacity onPress={() => navigation.navigate(SCREENS.hourly, { forecast, name })}><Today forecast={forecast} /></TouchableOpacity>
              <FiveDays forecast={forecast} />
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
          <AppBar location={name} navigation={navigation} />
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
