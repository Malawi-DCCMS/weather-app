import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { DataTable, Icon } from 'react-native-paper';
import { DateTime } from "luxon";

import weatherIcons from '../constants/weathericons.constant';
import { WeatherDataDaySummary } from '../utils/weatherData';

type HourlyTableProps = {
  title: string;
  daySummary: WeatherDataDaySummary;
  day: DateTime;
};

/**
 * Get today's forecast
 */
function HourlyTable(props: HourlyTableProps): JSX.Element {
  const isSameDay = props.day.hasSame(DateTime.local(), "day");
  const dayName = isSameDay ? 'Today' : props.day.toFormat('ccc');
  return (
    <View style={styles.container}>
      <View style={styles.opacity}>
        <View style={styles.title}>
          <Text style={styles.titleText}>{dayName} {props.day.toFormat('dd LLL')}</Text>
        </View>
        <DataTable style={styles.table}>
          <DataTable.Header>
            <DataTable.Title><Text style={styles.whiteHeader}>Time</Text></DataTable.Title>
            <DataTable.Title><Text></Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.whiteHeader}>Temp C&deg;</Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.whiteHeader}>Rain mm</Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.whiteHeader}>Wind km/h</Text></DataTable.Title>
          </DataTable.Header>
          <ScrollView snapToStart={false} showsVerticalScrollIndicator={false}>
            {props.daySummary.steps.map((step) => (
              <DataTable.Row key={step.time.toISO()}>
                <DataTable.Cell><Text style={styles.whiteText}>{step.time.toLocaleString({ hour: '2-digit' })}</Text></DataTable.Cell>
                <DataTable.Cell><Icon source={weatherIcons[step.weatherSymbol()]} size={34} /></DataTable.Cell>
                <DataTable.Cell numeric><Text style={styles.whiteText}>{step.temperature ? Math.round(step.temperature) : ""}&deg;</Text></DataTable.Cell>
                <DataTable.Cell numeric><Text style={styles.whiteText}>{step.precipitation()}</Text></DataTable.Cell>
                <DataTable.Cell numeric><Text style={styles.whiteText}>{Math.round(step.windSpeed || 0)}</Text></DataTable.Cell>
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
