import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { DateTime } from "luxon";

import { useForecast } from '../hooks/current-forecast.hook';
import { District } from '../constants/districts.constant';
import weatherIcons from '../constants/weathericons.constant';
import { Forecast } from '../utils/weatherData';
import { GlassView } from '../components/GlassView';

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

  if (!forecast) {
    return (
      <View style={styles.wrapper}>
        <Text>Loading...</Text>
      </View>
    )
  }

  const today = new Forecast(forecast).atDay(DateTime.now())
  if (!today) {
    return (
      <View style={styles.wrapper}>
        <GlassView containerStyle={styles.glassWrapper} glassStyle={styles.glassWrapper} blurStyle={{ blurAmount: 20, blurType: 'light' }}>
          <View style={styles.opacity}>
            <View style={styles.left}>
              <Text>Forecast unavailable</Text>
            </View>
          </View>
        </GlassView>
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <GlassView containerStyle={styles.glassWrapper} glassStyle={styles.glassWrapper} blurStyle={{ blurAmount: 20, blurType: 'light' }}>
        <View style={styles.opacity}>
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
      </GlassView>
    </View>
  );
}


const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    marginTop: 17,
  },
  glassWrapper: {
    width: '100%',
    borderRadius: 4,
  },
  opacity: {
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingRight: 17,
    paddingLeft: 17,
    paddingTop: 10,
    paddingBottom: 10,
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
  },
  header: {
    fontSize: 24,
    fontFamily: 'NotoSans-Regular',
    color: 'white',
    fontWeight: "400",
  },
  small: {
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
    color: 'white',
    fontWeight: "400",
  },
  smallContainer: {
    marginTop: 5,
  },
});

export default LocationRow;
