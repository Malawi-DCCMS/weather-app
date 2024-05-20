import React from 'react';
import { ImageBackground, StyleSheet, View, ScrollView, Image, ListRenderItemInfo, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { BlurView } from '@react-native-community/blur';
import { Text } from 'react-native-paper';
import { DateTime } from 'luxon';

import AppBar from '../components/AppBar';
import { RootDrawerParamList } from '../common';
import appBackground from '../../assets/appbackground.png';
import urgency from '../../assets/urgency.png';
import severity from '../../assets/severity.png';
import certainity from '../../assets/certainity.png';
import WeatherAlert from '../components/WeatherAlert';
import timePeriodBullet from '../../assets/time-period-bullet.png';
import { CAPAlert } from '../lib/cap-client/alert';

type ScreenProps = NativeStackScreenProps<RootDrawerParamList, 'WeatherWarning'>;
function WeatherWarningScreen({ route, navigation }: ScreenProps): JSX.Element {
  const { location, alert } = route.params;

  type TimePeriods = Array<{key: string, val?: string}>;
  const getTimePeriodData = (alert: CAPAlert): TimePeriods => ([
    { key: 'Issued:', val: alert.info && alert.sent },
    { key: 'Effective:', val: alert.info && alert.info[0].effective?.toFormat('LLL. dd, yyyy, H:ss a') },
    { key: 'Onset:', val: alert.info && alert.info[0].onset?.toFormat('LLL. dd, yyyy, H:ss a') },
    { key: 'Expires:', val: alert.info && alert.info[0].expires?.toFormat('LLL. dd, yyyy, H:ss a') },
  ]);

  const renderTimePeriodItem = (item: ListRenderItemInfo<TimePeriods[0]>) => <View style={styles.timePeriodItem}>
    <Image style={styles.bulletStyle} source={timePeriodBullet}/><Text style={styles.timePeriodText}> {item.item.key} {item.item?.val}</Text>
  </View>;

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={location} navigation={navigation} />
          <View style={styles.contentContainer}>
            <WeatherAlert alert={alert} onPress={() => {}}/>
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} snapToStart={false}>
              <View style={styles.content}>
                <BlurView style={styles.blurCover} blurAmount={25} blurType='light' />
                <Text style={styles.whiteBoldText}>Event description:</Text>
                <Text style={styles.whiteText}>{alert.info && alert.info[0].description}{'\n'}</Text>
                <Text style={styles.whiteBoldText}>Instructions:</Text>
                <Text style={styles.whiteText}>{alert.info && alert.info[0].instruction}{'\n'}</Text>
                <Text style={styles.whiteBoldText}>Area:</Text>
                <Text style={styles.whiteText}>{alert.info && alert.info[0].area?.areaDesc}</Text>
              </View>
              <View style={styles.content}>
                <BlurView style={styles.blurCover} blurAmount={20} blurType='light' />
                <Text style={styles.whiteLargeText}>Time period</Text>
                <FlatList data={getTimePeriodData(alert)} renderItem={item =>renderTimePeriodItem(item)} key={new Date().toISOString()}/>
              </View>
              <View style={styles.content}>
                <BlurView style={styles.blurCover} blurAmount={20} blurType='light' />
                <View style={{flexDirection: 'row'}}>
                  <Image style={styles.icons} source={urgency}/>
                  <Text style={styles.whiteText}>Urgency:   {alert.info && alert.info[0].urgency}{'\n'}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Image style={styles.icons} source={severity}/>
                  <Text style={styles.whiteText}>Severity:    {alert.info && alert.info[0].severity}{'\n'}</Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Image style={styles.icons} source={certainity}/>
                  <Text style={styles.whiteText}>Certainty:  {alert.info && alert.info[0].certainty}</Text>
                </View>
              </View>
            </ScrollView>
          </View>
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
    padding: 0
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0
  },
  scrollView: {
    height: '100%',
    width: '100%',
  },
  content: {
    flex: 1,
    marginTop: 20,
    marginLeft: 19,
    marginRight: 19,
    paddingRight: 16,
    paddingLeft: 16,
    paddingTop: 18,
    paddingBottom: 18,
    borderRadius: 4,
  },
  blurCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, .15)',
  },
  whiteHeader: {
    color: 'white',
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'OpenSans',
  },
  whiteText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 19,
    fontFamily: 'OpenSans',
    flexDirection: 'row',
  },
  whiteLargeText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 21.79,
    fontFamily: 'OpenSans',
  },
  whiteBoldText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
    lineHeight: 22,
    fontFamily: 'OpenSans',
  },
  title: {
    color: 'white',
    fontSize: 22,
    lineHeight: 24,
    fontWeight: "600",
    fontFamily: 'OpenSans',
  },
  bg: {
    height: '100%',
  },
  icons: {
    width: 21,
    height: 21,
    marginRight: 14,
  },
  timePeriodItem: {
    flexDirection: 'row',
  },
  timePeriodText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 40,
    fontFamily: 'OpenSans',
  },
  bulletStyle: {
    height: 7,
    width: 7,
    alignSelf: 'center',
  },
});

export default WeatherWarningScreen;
