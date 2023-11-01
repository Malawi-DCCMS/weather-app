import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import moment from 'moment';

import { useCurrentForecast } from '../hooks/current-forecast.hook';
import MenuBar from "../components/MenuBar";
import { useCurrentPlace } from "../hooks/current-place.hook";
import { ForecastTimestep, WeatherForecast } from '../utils/locationforecast';
import DailyForecastRow from '../components/DailyForecastRow';
import appBackground from '../../assets/app-bg-normal.png';

function getCurrentForecast(
  forecast: WeatherForecast,
): ForecastTimestep | undefined {
  const value = forecast.properties.timeseries.find(f => {
    const now = moment().format('YYYY-MM-DD HH');
    const timeOfForecast = moment(f.time).format('YYYY-MM-DD HH');
    return now === timeOfForecast;
  });

  return value;
}

function HomeScreen(): JSX.Element {
  const place = useCurrentPlace();
  const forecast = useCurrentForecast(place.position.lat, place.position.long);
  const current = getCurrentForecast(forecast);
  const temp = current?.data.instant.details.air_temperature;
  const minTemp = current?.data.next_6_hours?.details?.air_temperature_min;
  const maxTemp = current?.data.next_6_hours?.details?.air_temperature_max;

  const forecastStub = [
    {
      day: 'Mon',
      warning: 'yellow',
      icon: 'clearsky_day',
      minTemp: 15,
      maxTemp: 21,
      windSpeed: 67,
    },
    {
      day: 'Tue',
      icon: 'clearsky_night',
      minTemp: 15,
      maxTemp: 21,
      windSpeed: 50,
    },
    {
      day: 'Wed',
      warning: 'yellow',
      icon: 'clearsky_day',
      minTemp: 14,
      maxTemp: 17,
      windSpeed: 1,
    },
    {
      day: 'Thu',
      icon: 'clearsky_day',
      minTemp: 15,
      maxTemp: 21,
      windSpeed: 12,
    },
    {
      day: 'Fri',
      warning: 'yellow',
      icon: 'clearsky_night',
      minTemp: 15,
      maxTemp: 21,
      windSpeed: 156,
    },
  ];

  return (<>
    <MenuBar location={place.name} />
    <ImageBackground source={appBackground}>
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <Text style={styles.todaysHeader} onPress={() => { }}>Today &gt;</Text>
        <View style={{
          alignItems: 'center', flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 5,
        }}>
          <Text style={styles.todaysForecastLarge}>{temp}&deg;</Text>
          <Text style={styles.todaysForecastSmall}>&uarr; {minTemp}&deg; &darr; {maxTemp}&deg; Showers</Text>
        </View>
      </View>
      <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 40 }}>
        {forecastStub.map((forecast, idx) => <DailyForecastRow key={idx} forecast={forecast} />)}
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
    fontFamily: 'Rajdhani',
    fontWeight: '100',
    textAlign: 'left',
  },
  todaysForecastLarge: {
    fontSize: 66,
    fontFamily: 'Rajdhani',
    flex: 4,
    textAlign: 'right',
  },
  todaysForecastSmall: {
    fontSize: 16,
    fontFamily: 'Rajdhani',
    fontWeight: '100',
    flex: 3,
    marginLeft: 10,
  },
  dailyForecastRow: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 16,
    padding: 10,
    marginTop: 5,
    flexDirection: 'row',
    fontSize: 16,
    justifyContent: 'space-evenly',
  },
});

export default HomeScreen;
