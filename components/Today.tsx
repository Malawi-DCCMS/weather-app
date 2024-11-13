import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { getForecastDescription } from '@/lib/forecast/forecast.utils';
import { WeatherDataDaySummary } from '@/lib/forecast/weatherData';

const forwardArrow = require('@/assets/icons8-forward-100.png');
const upArrow = require('@/assets/Arrow-upward.png');
const downArrow = require('@/assets/Arrow-downward.png');

type TodaysForecastProps = {
  daySummary: WeatherDataDaySummary | undefined;
};
function Today(props: TodaysForecastProps): JSX.Element {
  const { daySummary } = props

  if (!daySummary) {
    return (
      <View style={styles.wrapper}>
        <View style={styles.today}>
          <Text style={styles.todaysHeader}>Forecast unavailable</Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.opacity}>
        <View style={styles.today}>
          <View><Text style={styles.todaysHeader}>Today <Icon size={24} color='white' source={forwardArrow} /></Text></View>
          <View><Text style={styles.large}>{Math.round(daySummary.steps[0].temperature || 0)}&deg;</Text></View>
        </View>
        <View style={styles.temps}>
          <View>
            <Text style={styles.small}>
              <Icon size={15} color='white' source={upArrow} /> {Math.round(daySummary.maxTemperature || 0)}&deg; <Icon size={15} color='white' source={downArrow} /> {Math.round(daySummary.minTemperature || 0)}&deg;
            </Text>
          </View>
          <View>
            <Text style={styles.small}>
              {daySummary.weatherSymbol ? getForecastDescription(daySummary.weatherSymbol) : 'Not available'}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    marginRight: 27,
    marginLeft: 27,
  },
  glassWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 8,
  },
  opacity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(217, 217, 217, .5)',
  },
  today: {
    paddingTop: 38,
    paddingBottom: 18,
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  temps: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    marginLeft: 10,
  },
  todaysHeader: {
    fontSize: 24,
    fontFamily: 'Rajdhani-Regular',
    marginBottom: -15,
    marginLeft: 8,
    color: 'white',
  },
  large: {
    fontSize: 92,
    fontFamily: 'Rajdhani-Regular',
    color: 'white',
  },
  small: {
    fontSize: 16,
    fontFamily: 'Rajdhani-Light',
    color: 'white',
  },
});

export default Today;
