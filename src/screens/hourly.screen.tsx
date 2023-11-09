import React from 'react';
import { Alert, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { DataTable, Icon } from 'react-native-paper';

import MenuBar from "../components/MenuBar";
import { useCurrentPlace } from "../hooks/current-place.hook";
import appBackground from '../../assets/app-bg-faded.png';
import weatherIcons from '../constants/weathericons';
import { useForecast } from '../hooks/current-forecast.hook';
import moment from 'moment';
import { ForecastTimestep, WeatherForecast } from '../utils/locationforecast';

function getTodaysTimesteps(forecast: WeatherForecast): Array<ForecastTimestep> {
  const floor = moment(`${moment().subtract(1, 'days').format('YYYY-MM-DD')} 22:00:00`);
  const ceiling = moment(`${moment().format('YYYY-MM-DD')} 21:00:00`);
  return forecast.properties.timeseries.filter(f => moment(f.time).isBetween(floor, ceiling));
}


function sortTimesteps(timesteps: Array<ForecastTimestep>): Array<ForecastTimestep> {
  return timesteps.sort((first, second) => moment(first.time).isBefore(moment(second.time)) ? -1 : 1);
}

function HourlyScreen(): JSX.Element {
  const place = useCurrentPlace();
  const [, forecast, error] = useForecast(place.position.lat, place.position.long);

  if (error) {
    Alert.alert(error.message);
    return <></>;
  }

  if (forecast) {
    const timesteps = getTodaysTimesteps(forecast);
    const sorted = sortTimesteps(timesteps);
    return (
      <>
        <MenuBar location={place.name} />
        <ImageBackground source={appBackground}>
          <View style={styles.mainContainer}>
            <Text style={{fontSize: 20, fontFamily: 'Rajdhani-Regular', paddingLeft: 25, paddingTop: 20}}>Hourly today</Text>
            <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 5 }}>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>Time</DataTable.Title>
                  <DataTable.Title><Text></Text></DataTable.Title>
                  <DataTable.Title numeric>Temp C&deg;</DataTable.Title>
                  <DataTable.Title numeric>Rain mm</DataTable.Title>
                  <DataTable.Title numeric>Wind km/h</DataTable.Title>
                </DataTable.Header>
  
                {sorted.map((hour) => (
                  <DataTable.Row key={hour.time}>
                    <DataTable.Cell>{moment(hour.time).format('HH:mm')}</DataTable.Cell>
                    <DataTable.Cell><Icon source={weatherIcons[hour.data.next_1_hours?.summary?.symbol_code || 'fair_day']} size={25} /></DataTable.Cell>
                    <DataTable.Cell numeric>{hour.data.instant.details.air_temperature}&deg;</DataTable.Cell>
                    <DataTable.Cell numeric>{hour.data.next_1_hours?.details?.precipitation_amount}</DataTable.Cell>
                    <DataTable.Cell numeric>{hour.data.instant.details.wind_speed}</DataTable.Cell>
                  </DataTable.Row>
                ))}</DataTable>
            </View>
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
    padding: 12,
  },
  todaysHeader: {
    width: '60%',
    fontSize: 24,
    fontFamily: 'Rajdhani-Regular',
    textAlign: 'left',
  },
});

export default HourlyScreen;
