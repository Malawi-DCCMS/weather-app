import React, { JSX } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { WeatherDataDaySummary } from '@/lib/forecast/weatherData';
import { useTranslation } from 'react-i18next';

const forwardArrow = require('@/assets/icons8-forward-100.png');
const upArrow = require('@/assets/Arrow-upward.png');
const downArrow = require('@/assets/Arrow-downward.png');

type TodaysForecastProps = {
  daySummary: WeatherDataDaySummary | undefined;
};
function Today(props: TodaysForecastProps): JSX.Element {
  const { t } = useTranslation();

  const { daySummary } = props;

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
        <View style={styles.todayText}><Text style={styles.todaysHeader}>{t('Today')} {">"}</Text></View>
        <View style={styles.today}>
          <View><Text style={styles.large}>{Math.round(daySummary.steps[0].temperature || 0)}&deg;</Text></View>
        </View>
        <View style={styles.temps}>
          <View>
            <Text style={styles.small}>
              <Icon size={15} color='white' source={upArrow} /> {Math.round(daySummary.maxTemperature || 0)}&deg;<View style={{ paddingRight: 24 }}></View><Icon size={15} color='white' source={downArrow} /> {Math.round(daySummary.minTemperature || 0)}&deg;
            </Text>
          </View>
          <View>
            <Text style={styles.smallSymbol} numberOfLines={2}>
              {daySummary.weatherSymbol ? t(daySummary.weatherSymbol) : t('Not available')}
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
    flexDirection: 'column',
    justifyContent: 'flex-start',
    flex: 1,
    borderRadius: 4,
    backgroundColor: 'rgba(217, 217, 217, .5)',
    padding: 8,
  },
  today: {
    flex: 1,
    paddingTop: 38,
    paddingBottom: 18,
    textAlign: 'center',
  },
  todayText: {
    flex: 1,
  },
  temps: {
    margin: 8,
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
    textAlign: 'center',
  },
  small: {
    fontSize: 16,
    fontFamily: 'Rajdhani-Light',
    color: 'white',
  },
  smallSymbol: {
    fontSize: 16,
    fontFamily: 'Rajdhani-Light',
    color: 'white',
    maxWidth: 150
  },
});

export default Today;
