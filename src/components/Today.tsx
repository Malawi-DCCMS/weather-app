import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { getForecastDescription } from '../utils/forecast.utils';
import { DaySummary } from '../utils/weatherData';


type TodaysForecastProps = {
  daySummary: DaySummary;
};
function Today(props: TodaysForecastProps): JSX.Element {
  const {daySummary} = props
  return (
    <View style={styles.wrapper}>
      <View style={styles.today}>
        <View><Text style={styles.todaysHeader}>Today &gt;</Text></View>
        <View><Text style={styles.large}>{Math.round(daySummary.steps[0].temperature || 0)}&deg;</Text></View>
      </View>
      <View style={styles.temps}>
        <View>
          <Text style={styles.small}>
            &uarr; {Math.round(daySummary.maxTemperature||0)}&deg; &darr; {Math.round(daySummary.minTemperature||0)}&deg;
          </Text>
        </View>
        <View>
          <Text style={styles.small}>
            {daySummary.weatherSymbol ? getForecastDescription(daySummary.weatherSymbol) : 'Not available'}
          </Text>
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
    marginTop: 60,
  },
  today: {
    flexDirection: 'column',
    justifyContent: 'flex-start'
  },
  temps: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    paddingTop: 35,
    marginLeft: 10,
  },
  todaysHeader: {
    fontSize: 24,
    fontFamily: 'Rajdhani-Regular',
    marginBottom: -15,
    marginLeft: 8,
  },
  large: {
    fontSize: 96,
    fontFamily: 'Rajdhani-Regular',
  },
  small: {
    fontSize: 16,
    fontFamily: 'Rajdhani-Light',
  }
});

export default Today;
