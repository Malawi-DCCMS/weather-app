import React from 'react';
import { ImageBackground, StyleSheet, View, ScrollView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';

import appBackground from '../../assets/appbackground.png';
import AppBar from '../components/AppBar';
import LocationRow from '../components/LocationRow';
import { DISTRICTS } from '../constants/districts.constant';
import { AppDispatch } from '../store';
import { RootDrawerParamList } from '../common';
import { setForecast } from '../store/forecast.slice';
import { setLat, setLon, setName } from '../store/location.slice';
import { SCREENS } from '../constants/screens.constant';
import { WeatherForecast } from '../utils/locationforecast';

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'NoLocation'>;
const NoLocationScreen = ({ navigation }: ScreenProps) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location='Zanyengo' navigation={navigation} />
          <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false} snapToStart={false}>
            {
              DISTRICTS.map((district, idx) =>
                <LocationRow
                  key={idx}
                  district={district}
                  onPress={(forecast: WeatherForecast): void => {
                    dispatch(setForecast(forecast))
                    dispatch(setName(district.name));
                    dispatch(setLat(district.lat));
                    dispatch(setLon(district.lon));
                    navigation.navigate(SCREENS.Home);
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