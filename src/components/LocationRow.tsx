import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { DateTime } from "luxon";

import { useForecast } from '../hooks/current-forecast.hook';
import { District } from '../constants/districts.constant';
import weatherIcons from '../constants/weathericons.constant';
import { Forecast } from '../utils/weatherData';

type LocationRowProps = {
  district: District;
};
function LocationRow(props: LocationRowProps): JSX.Element {
  const [, forecast, error] = useForecast(props.district.lat, props.district.lon);

  if (error) {
    <View style={styles.wrapper}>
      <Text>Not available...</Text>
    </View>
  }

  if (forecast) {
    const today = new Forecast(forecast).atDay(DateTime.now())

    return (
      <View style={styles.wrapper}>
        <View style={styles.left}>
          <View>
            <Text style={styles.header}>{props.district.name}</Text>
          </View>
          <View style={styles.smallContainer}>
            <Text style={styles.small}>&uarr;{Math.round(today.maxTemperature || 0)}&deg;  &darr;{Math.round(today.minTemperature || 0)}&deg;</Text>
          </View>
        </View>
        <View style={styles.right}>
          <Icon source={weatherIcons[today.weatherSymbol || 'fair_day']} size={60} />
        </View>
      </View>
    );
  }

  return <View style={styles.wrapper}>
    <Text>Loading...</Text>
  </View>;
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    width: '90%',
    flexDirection: 'row',
    marginTop: 20,
    paddingRight: 17,
    paddingLeft: 17,
    paddingTop: 10,
    paddingBottom: 10,
    backgroundColor: '#F5F5F0',
    borderRadius: 4,
  },
  left: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontFamily: 'NotoSans-Regular',
  },
  small: {
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
  },
  smallContainer: {
    marginTop: 5,
  }
});

export default LocationRow;
