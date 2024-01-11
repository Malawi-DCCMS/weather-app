import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
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
  const fallbackSymbolCode = (when: DateTime) => {
    console.log('unable to find weather symbol at ' + when.toLocaleString())
    return 'fair_day' // TODO: find out how to handle this
  } 

  // for (const step of props.daySummary.steps) {
  //   console.log(step.time, step.weatherSymbol_1h, step.temperature, step.precipitation_1h, step.windSpeed)
  // }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{props.title}</Text>
      <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 5 }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Time</DataTable.Title>
            <DataTable.Title><Text></Text></DataTable.Title>
            <DataTable.Title numeric>Temp C&deg;</DataTable.Title>
            <DataTable.Title numeric>Rain mm</DataTable.Title>
            <DataTable.Title numeric>Wind km/h</DataTable.Title>
          </DataTable.Header>
          <ScrollView snapToStart={false}>
            { props.daySummary.steps.map((step) => (
              <DataTable.Row key={step.time.toISO()}>
                <DataTable.Cell>{step.time.toLocaleString(DateTime.TIME_24_SIMPLE)}</DataTable.Cell>
                <DataTable.Cell><Icon source={weatherIcons[step.weatherSymbol_1h || fallbackSymbolCode(step.time)]} size={25} /></DataTable.Cell>
                <DataTable.Cell numeric>{step.temperature}&deg;</DataTable.Cell>
                <DataTable.Cell numeric>{step.precipitation_1h}</DataTable.Cell>
                <DataTable.Cell numeric>{step.windSpeed}</DataTable.Cell>
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
  header: {
    fontSize: 20,
    fontFamily: 'Rajdhani-Regular',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 20,
  },
});

export default HourlyTable;
