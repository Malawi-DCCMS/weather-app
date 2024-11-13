import React from 'react';
import { ImageBackground, StyleSheet, View, ScrollView } from 'react-native';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useRouter, Href} from 'expo-router';

import AppBar from '@/components/AppBar';
import LocationRow from '@/components/LocationRow';

import { DISTRICTS } from '@/lib/geo/constants';
import { AppDispatch } from '@/lib/store';
import { setForecast } from '@/lib/store/forecast.slice';
import { setLat, setLon, setName } from '@/lib/store/location.slice';
import { SCREENS } from '@/lib/layout/constants';
import { Forecast } from '@/lib/forecast/types';

const appBackground = require('@/assets/new-glass-bg.png');

const NoLocationScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location='Zanyengo' />
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} snapToStart={false}>
            {
              DISTRICTS.map((district, idx) =>
                <LocationRow
                  key={idx}
                  district={district}
                  onPress={(forecast: Forecast): void => {
                    dispatch(setForecast(forecast))
                    dispatch(setName(district.name));
                    dispatch(setLat(district.lat));
                    dispatch(setLon(district.lon));
                    router.navigate(SCREENS.Home.toString() as Href);
                  }}
                />)
            }
          </ScrollView>
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
}

export default NoLocationScreen;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
  },
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 18,
    marginRight: 18,
  },
  bg: {
    height: '100%',
  }
})