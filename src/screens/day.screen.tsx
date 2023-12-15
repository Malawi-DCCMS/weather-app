import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import appBackground from '../../assets/app-bg-faded.png';
import AppBar from '../components/AppBar';
import { ForecastTimestep } from '../utils/locationforecast';
import HourlyTable from '../components/HourlyTable';
import { RootDrawerParamList } from '../common';

function sortTimesteps(timesteps: Array<ForecastTimestep>): Array<ForecastTimestep> {
  return timesteps.sort((first, second) => moment(first.time).isBefore(moment(second.time)) ? -1 : 1);
}

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'Day'>;
function DayScreen({ route, navigation }: ScreenProps): JSX.Element {
  const { forecast, name } = route.params;
  const sorted = sortTimesteps(forecast);
  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={name} navigation={navigation} />
          <HourlyTable forecast={sorted} title={moment(forecast[0].time).format('dddd')} />
        </ImageBackground>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
    overflow: 'scroll',
  },
  bg: {
    height: '100%',
  },
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

export default DayScreen;
