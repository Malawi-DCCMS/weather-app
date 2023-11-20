import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { DataTable, Icon } from 'react-native-paper';
import moment from 'moment';

import weatherIcons from '../constants/weathericons.constant';
import { ForecastTimestep } from '../utils/locationforecast';

type HourlyTableProps = {
  forecast: Array<ForecastTimestep>;
};

function HourlyTable(props: HourlyTableProps): JSX.Element {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Hourly today</Text>
      <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 5 }}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Time</DataTable.Title>
            <DataTable.Title><Text></Text></DataTable.Title>
            <DataTable.Title numeric>Temp C&deg;</DataTable.Title>
            <DataTable.Title numeric>Rain mm</DataTable.Title>
            <DataTable.Title numeric>Wind km/h</DataTable.Title>
          </DataTable.Header>
          <ScrollView>
            {props.forecast.map((hour) => (
              <DataTable.Row key={hour.time}>
                <DataTable.Cell>{moment(hour.time).format('HH:mm')}</DataTable.Cell>
                <DataTable.Cell><Icon source={weatherIcons[hour.data.next_1_hours?.summary?.symbol_code || 'fair_day']} size={25} /></DataTable.Cell>
                <DataTable.Cell numeric>{hour.data.instant.details.air_temperature}&deg;</DataTable.Cell>
                <DataTable.Cell numeric>{hour.data.next_1_hours?.details?.precipitation_amount}</DataTable.Cell>
                <DataTable.Cell numeric>{hour.data.instant.details.wind_speed}</DataTable.Cell>
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
