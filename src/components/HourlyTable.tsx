import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { DataTable, Icon } from 'react-native-paper';
import { DateTime } from "luxon";

import weatherIcons from '../constants/weathericons.constant';
import { WeatherDataDaySummary } from '../utils/weatherData';
import { useTranslation } from 'react-i18next';

type HourlyTableProps = {
  title: string;
  daySummary: WeatherDataDaySummary;
  day: DateTime;
};

/**
 * Get today's forecast
 */
function HourlyTable(props: HourlyTableProps): JSX.Element {
  const { t } = useTranslation();
  const isSameDay = props.day.hasSame(DateTime.local(), "day");
  const dayName = isSameDay ? t('Today') : props.day.toFormat('ccc');
  return (
    <View style={styles.container}>
      <View style={styles.opacity}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{t(dayName)} {props.day.toFormat('dd LLL')}</Text>
        </View>
        <DataTable style={styles.table}>
          <DataTable.Header>
            <DataTable.Title><Text style={styles.whiteHeader}>{t('Time')}</Text></DataTable.Title>
            <DataTable.Title><Text></Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.whiteHeader}>{t('Temp')}</Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.whiteHeader}>{t('Rain')}</Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.whiteHeader}>{t('Wind')}</Text></DataTable.Title>
          </DataTable.Header>
          <ScrollView snapToStart={false} showsVerticalScrollIndicator={false}>
            {props.daySummary.steps.map((step) => (
              <DataTable.Row key={step.time.toISO()}>
                <DataTable.Cell><Text style={styles.whiteText}>{step.time.toLocaleString({ hour: '2-digit' })}</Text></DataTable.Cell>
                <DataTable.Cell accessible={true} accessibilityLabel={`Weather symbol on ${props.day.toFormat('dd LLL')} at ${step.time.toLocaleString({ hour: '2-digit' })} is ${step.weatherSymbol().split('_').join(' ')}.`}><Icon source={weatherIcons[step.weatherSymbol()]} size={34} /></DataTable.Cell>
                <DataTable.Cell numeric><Text style={styles.whiteText}>{step.temperature ? Math.round(step.temperature) : ""}&deg;C</Text></DataTable.Cell>
                <DataTable.Cell numeric><Text style={styles.whiteText}>{step.precipitation()}mm</Text></DataTable.Cell>
                <DataTable.Cell numeric><Text style={styles.whiteText}>{Math.round(step.windSpeed || 0)}kph</Text></DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </DataTable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  title: {
    paddingLeft: 24,
    paddingRight: 20,
    paddingTop: 15,
    marginTop: 5,
  },
  titleText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
  table: {
    paddingLeft: 24,
    paddingRight: 20,
    paddingTop: 5,
    flex: 1
  },
  opacity: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'rgba(100, 100, 100, .1)',
  },
  whiteHeader: {
    color: 'white',
  },
  whiteText: {
    color: 'white',
    fontSize: 16,
  },
});

export default HourlyTable;
