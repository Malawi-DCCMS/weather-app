import * as React from 'react';
import { Alert, ImageBackground, StyleSheet, Text, View, ScrollView } from 'react-native';

import { useCurrentPlace } from '../hooks/current-place.hook';
import appBackground from '../../assets/app-bg-normal.png';
import AppBar from '../components/AppBar';
import { useForecast } from '../hooks/current-forecast.hook';
import Today from '../components/Today';
import FiveDays from '../components/FiveDays';

const MainScreen = () => {
  const place = useCurrentPlace();
  const [, forecast, error] = useForecast(place.position.lat, place.position.long);

  if (error) {
    Alert.alert(error.message);
    return <></>
  }

  if (forecast) {
    return (
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={place.name} />
          <ScrollView>
            <Today forecast={forecast} />
            <FiveDays forecast={forecast} />
          </ScrollView>

        </ImageBackground>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ImageBackground source={appBackground}>
        <AppBar location={place.name} />
        <Text>Loading...</Text>
      </ImageBackground>
    </View>
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
})