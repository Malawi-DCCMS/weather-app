import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';
import { DateTime } from 'luxon';

import { useForecast } from '@/lib/hooks/current-forecast.hook';
import { District } from '@/lib/geo/constants';
import weatherIcons from '@/lib/forecast/weathericons.constant';
import { WeatherData } from '@/lib/forecast/weatherData';
import { Forecast } from '@/lib/forecast/types';
import { useTranslation } from 'react-i18next';


type LocationRowProps = {
  district: District;
  onPress: (forecast: Forecast) => void
};
function LocationRow(props: LocationRowProps): JSX.Element {
  const { t } = useTranslation();

  const { district, onPress } = props;
  const [, forecast, error] = useForecast(district.lat, district.lon);

  if (error) {
    return <ForecastError msg={t('There was an error getting the forecast') + '.'} />
  }

  if (forecast) {
    const today = new WeatherData(forecast).atDay(DateTime.now())
    if (!today) {
      return <ForecastError msg={t('Forecast unavailable.')} />
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
    fontWeight: '400',
  },
  small: {
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
    color: 'white',
    fontWeight: '400',
  },
  smallContainer: {
    marginTop: 5,
  },
});

export default LocationRow;
