import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';
import { DateTime } from "luxon";
import { BlurView } from '@react-native-community/blur';

import { useForecast } from '../hooks/current-forecast.hook';
import { District } from '../constants/districts.constant';
import weatherIcons from '../constants/weathericons.constant';
import { Forecast } from '../utils/weatherData';
import { WeatherForecast } from '../utils/locationforecast';


type LocationRowProps = {
  district: District;
  onPress: (forecast: WeatherForecast) => void
};
function LocationRow(props: LocationRowProps): JSX.Element {
  const { district, onPress } = props;
  const [, forecast, error] = useForecast(district.lat, district.lon);

  if (error) {
    return <ForecastError msg="There was an error getting the forecast." />
  }

  if (forecast) {
    const today = new Forecast(forecast).atDay(DateTime.now())
    if (!today) {
      return <ForecastError msg="Forecast unavailable." />
    }

    return (
      <TouchableOpacity style={styles.wrapper} onPress={() => onPress(forecast)}>
        <View style={styles.glassWrapper}>
          <View style={styles.opacity}>
            <View style={styles.left}>
              <View>
                <Text style={styles.header}>{district.name}</Text>
              </View>
              <View style={styles.smallContainer}>
                <Text style={styles.small}>&uarr;{Math.round(today.maxTemperature || 0)}&deg;  &darr;{Math.round(today.minTemperature || 0)}&deg;</Text>
              </View>
            </View>
            <View style={styles.right}>
              <Icon source={weatherIcons[today.weatherSymbol || 'fair_day']} size={90} />
            </View>
          </View>
          <BlurView blurAmount={25} blurType='light' />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.glassWrapper}>
        <View style={styles.opacity}>
          <View style={styles.left}>
            <View>
              <ActivityIndicator animating={true} color={'white'} size={34} />
            </View>
          </View>
        </View>
        <BlurView blurAmount={25} blurType='light' />
      </View>
    </View>
  )
}


function ForecastError(props: { msg: string }): JSX.Element {
  return (
    <View style={styles.wrapper}>
      <View style={styles.glassWrapper}>
        <View style={styles.opacity}>
          <View style={styles.left}>
            <View>
              <Text style={styles.small}>{props.msg}</Text>
            </View>
          </View>
        </View>
        <BlurView blurAmount={25} blurType='light' />
      </View>
    </View>
  )
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
  blurBar: {
    position: 'absolute',
    top: 0,
    height: '100%',
    width: '100%',
    zIndex: 0,
  },
  opacity: {
    backgroundColor: 'rgba(193, 193, 193, 0.5)',
    flex: 1,
    flexDirection: 'row',
    width: '100%',
    paddingRight: 17,
    paddingLeft: 17,
    paddingTop: 10,
    paddingBottom: 10,
    zIndex: 1,
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
