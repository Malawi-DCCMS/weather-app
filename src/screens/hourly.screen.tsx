import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { DataTable, Icon } from 'react-native-paper';

import MenuBar from "../components/MenuBar";
import { useCurrentPlace } from "../hooks/current-place.hook";
import appBackground from '../../assets/app-bg-faded.png';
import weatherIcons from '../constants/weathericons';

function HourlyScreen(): JSX.Element {
  const place = useCurrentPlace();

  const [items] = React.useState([
    {
      key: 1,
      time: '8am',
      icon: 'clearsky_night',
      temperature: 15,
      rainfall: 21,
      windSpeed: 156,
    },
    {
      key: 2,
      time: '9am',
      icon: 'clearsky_day',
      temperature: 15,
      rainfall: 21,
      windSpeed: 156,
    },
    {
      key: 3,
      time: '10am',
      icon: 'cloudy',
      temperature: 15,
      rainfall: 21,
      windSpeed: 156,
    },
    {
      key: 4,
      time: '11am',
      icon: 'fog',
      temperature: 15,
      rainfall: 21,
      windSpeed: 156,
    },
    {
      key: 5,
      time: '12pm',
      icon: 'heavyrain',
      temperature: 15,
      rainfall: 21,
      windSpeed: 156,
    },
    {
      key: 6,
      time: '10am',
      icon: 'lightrain',
      temperature: 15,
      rainfall: 21,
      windSpeed: 156,
    },
    {
      key: 7,
      time: '11am',
      icon: 'clearsky_night',
      temperature: 15,
      rainfall: 21,
      windSpeed: 156,
    },
    {
      key: 8,
      time: '12pm',
      icon: 'rain',
      temperature: 15,
      rainfall: 21,
      windSpeed: 156,
    },
    {
      key: 9,
      time: '1pm',
      icon: 'clearsky_night',
      temperature: 15,
      rainfall: 21,
      windSpeed: 156,
    },
  ]);

  return (
    <>
      <MenuBar location={place.name} />
      <ImageBackground source={appBackground}>
        <View style={styles.mainContainer}>
          <Text style={{fontSize: 20, fontWeight: '500', paddingLeft: 25, paddingTop: 20}}>Hourly today</Text>
          <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 5 }}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Time</DataTable.Title>
                <DataTable.Title><Text></Text></DataTable.Title>
                <DataTable.Title numeric>Temp C&deg;</DataTable.Title>
                <DataTable.Title numeric>Rain mm</DataTable.Title>
                <DataTable.Title numeric>Wind km/h</DataTable.Title>
              </DataTable.Header>

              {items.map((item) => (
                <DataTable.Row key={item.key}>
                  <DataTable.Cell>{item.time}</DataTable.Cell>
                  <DataTable.Cell><Icon source={weatherIcons[item.icon]} size={25} /></DataTable.Cell>
                  <DataTable.Cell numeric>{item.temperature}&deg;</DataTable.Cell>
                  <DataTable.Cell numeric>{item.rainfall}</DataTable.Cell>
                  <DataTable.Cell numeric>{item.windSpeed}</DataTable.Cell>
                </DataTable.Row>
              ))}</DataTable>
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

export default HourlyScreen;
