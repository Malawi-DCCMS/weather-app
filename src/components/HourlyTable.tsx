import React from 'react';
import { StyleSheet, Text, View, ScrollView, FlatList } from 'react-native';
import { DataTable, Icon } from 'react-native-paper';
import { DateTime } from "luxon";

import weatherIcons from '../constants/weathericons.constant';
import { DaySummary } from '../utils/weatherData';

type HourlyTableProps = {
  title: string;
  daySummary: DaySummary;
  day: DateTime;
};

/**
 * Get today's forecast
 */
function HourlyTable(props: HourlyTableProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>{props.title}</Text>
      <DataTable style={styles.table}>
        <DataTable.Header>
          <DataTable.Title>Time</DataTable.Title>
          <DataTable.Title><Text></Text></DataTable.Title>
          <DataTable.Title numeric>Temp C&deg;</DataTable.Title>
          <DataTable.Title numeric>Rain mm</DataTable.Title>
          <DataTable.Title numeric>Wind km/h</DataTable.Title>
        </DataTable.Header>
        <ScrollView snapToStart={false}>
          {props.daySummary.steps.map((step) => (
            <DataTable.Row key={step.time.toISO()}>
              <DataTable.Cell>{step.time.toLocaleString(DateTime.TIME_24_SIMPLE)}</DataTable.Cell>
              <DataTable.Cell><Icon source={weatherIcons[step.weatherSymbol()]} size={25} /></DataTable.Cell>
              <DataTable.Cell numeric>{step.temperature}&deg;</DataTable.Cell>
              <DataTable.Cell numeric>{step.precipitation()}</DataTable.Cell>
              <DataTable.Cell numeric>{step.windSpeed}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </ScrollView>
      </DataTable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  header: {
    fontSize: 20,
    fontFamily: 'Rajdhani-Regular',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
  },
  table: {
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 5,
    flex: 1
  }
});

export default HourlyTable;
