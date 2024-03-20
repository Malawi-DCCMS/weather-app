import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { DataTable, Icon } from 'react-native-paper';
import { DateTime } from "luxon";

import weatherIcons from '../constants/weathericons.constant';
import { DaySummary } from '../utils/weatherData';
import { GlassView } from '../components/GlassView';

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
    <GlassView glassStyle={styles.container} containerStyle={styles.container} blurStyle={{ blurAmount: 25, blurType: 'light' }}>
      <View style={styles.opacity}>
        <DataTable style={styles.table}>
          <DataTable.Header>
            <DataTable.Title><Text style={styles.whiteHeader}>Time</Text></DataTable.Title>
            <DataTable.Title><Text></Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.whiteHeader}>Temp C&deg;</Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.whiteHeader}>Rain mm</Text></DataTable.Title>
            <DataTable.Title numeric><Text style={styles.whiteHeader}>Wind km/h</Text></DataTable.Title>
          </DataTable.Header>
          <ScrollView snapToStart={false}>
            {props.daySummary.steps.map((step) => (
              <DataTable.Row key={step.time.toISO()}>
                <DataTable.Cell><Text style={styles.whiteText}>{step.time.toLocaleString({ hour: '2-digit' })}</Text></DataTable.Cell>
                <DataTable.Cell><Icon source={weatherIcons[step.weatherSymbol()]} size={34} /></DataTable.Cell>
                <DataTable.Cell numeric><Text style={styles.whiteText}>{step.temperature ? Math.round(step.temperature) : ""}&deg;</Text></DataTable.Cell>
                <DataTable.Cell numeric><Text style={styles.whiteText}>{step.precipitation()}</Text></DataTable.Cell>
                <DataTable.Cell numeric><Text style={styles.whiteText}>{Math.round(step.windSpeed)}</Text></DataTable.Cell>
              </DataTable.Row>
            ))}
          </ScrollView>
        </DataTable>
      </View>
    </GlassView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
  },
  table: {
    paddingLeft: 24,
    paddingRight: 20,
    paddingTop: 40,
    marginTop: 5,
    flex: 1
  },
  opacity: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: 'rgba(125, 125, 125, .1)',
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
