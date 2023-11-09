import React from 'react';
import { Alert, ImageBackground, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useForecast } from '../hooks/current-forecast.hook';
import MenuBar from "../components/MenuBar";
import { useCurrentPlace } from "../hooks/current-place.hook";
import appBackground from '../../assets/app-bg-normal.png';
import DailyForecast from '../components/DailyForecast';
import TodaysForecast from '../components/TodaysForecast';

function HomeScreen(): JSX.Element {
  const place = useCurrentPlace();
  const [, forecast, error] = useForecast(place.position.lat, place.position.long);

  if (error) {
    Alert.alert(error.message);
    return <></>
  }

  if (forecast) {
    return (<>
      <MenuBar location={place.name} />
      <ImageBackground source={appBackground}>
        <View style={styles.mainContainer}>
          <TodaysForecast  forecast={forecast} />
          <DailyForecast forecast={forecast}/>
        </View>
      </ImageBackground>
    </>
    );
  }

  return (
    <>
      <MenuBar location={place.name} />
      <ImageBackground source={appBackground}>
        <View style={styles.mainContainer}>
          <View style={styles.container}>
            <Text style={styles.todaysHeader} onPress={() => { }}>Loading...</Text>
          </View>
        </View>
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    width: '100%',
    height: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 61,
  },
  todaysHeader: {
    width: '60%',
    fontSize: 24,
    fontFamily: 'Rajdhani-Regular',
    textAlign: 'left',
  },
});

export default HomeScreen;
