import React from 'react';
import { ImageBackground, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import appBackground from '../../assets/app-bg-faded.png';
import AppBar from '../components/AppBar';
import HourlyTable from '../components/HourlyTable';
import { RootDrawerParamList } from '../common';
import { DateTime } from "luxon";


type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'Hourly'>;
function HourScreen({ route, navigation }: ScreenProps): JSX.Element {
  const { location, daySummary, title} = route.params;

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={location} navigation={navigation} />
          <HourlyTable daySummary={daySummary} day={DateTime.now()} title={title}/>
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

export default HourScreen;
