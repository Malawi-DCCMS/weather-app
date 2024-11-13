import React from 'react';
import { ImageBackground, StyleSheet, View, Image, ListRenderItemInfo, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { DateTime } from 'luxon';
import { useLocalSearchParams } from 'expo-router';
import { useSelector } from 'react-redux';

import AppBar from '@/components/AppBar';
import WeatherAlert from '@/components/WeatherAlert';

import { RootState } from '@/lib/store';
import { CAPAlert } from '@/lib/alerts/alert';

const timePeriodBullet = require('@/assets/time-period-bullet.png');
const urgency = require('@/assets/urgency.png');
const severity = require('@/assets/severity.png');
const certainity = require('@/assets/certainity.png');
const appBackground = require('@/assets/new-glass-bg.png');

function WeatherWarningScreen(): JSX.Element {
  const { location, alertID } = useLocalSearchParams<{location:string, alertID: string}>()

  const { alerts } = useSelector((state: RootState) => state.alerts);
  const alert = alerts.find(alert => alert.identifier === alertID)

  type TimePeriods = Array<{key: string, val?: string}>;
  const getTimePeriodData = (alert: CAPAlert): TimePeriods => ([
    { key: 'Issued:', val: alert.info && DateTime.fromISO(alert.sent).toFormat('LLL. dd, yyyy, H:mm a') },
    { key: 'Effective:', val: alert.info && alert.info[0].effective && 
      DateTime.fromISO(alert.info[0].effective).toFormat('LLL. dd, yyyy, H:mm a') },
    { key: 'Onset:', val: alert.info && alert.info[0].onset && 
      DateTime.fromISO(alert.info[0].onset).toFormat('LLL. dd, yyyy, H:mm a') },
    { key: 'Expires:', val: alert.info && alert.info[0].expires && 
      DateTime.fromISO(alert.info[0].expires).toFormat('LLL. dd, yyyy, H:mm a') },
  ]);

  const renderTimePeriodItem = (item: ListRenderItemInfo<TimePeriods[0]>) => <View style={styles.timePeriodItem}>
    <Image style={styles.bulletStyle} source={timePeriodBullet}/><Text style={styles.timePeriodText}> {item.item.key} {item.item?.val}</Text>
  </View>;

   // content for missing alert
   let mainContent: React.JSX.Element = (
    <View style={styles.contentContainer}>
      <Text>
        Missing alert! Please go back and try again.
      </Text>
    </View>
  )

  if(alert) {
    mainContent = (
      <View style={styles.contentContainer}>
        <WeatherAlert alert={alert} onPress={() => {}}/>
        <FlatList
          data={[{ key: 'data' }]}
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          snapToStart={false}
          renderItem={() => (
            <>
              <View style={styles.content}>
                <Text style={styles.whiteBoldText}>Event description:</Text>
                <Text style={styles.whiteText}>{alert.info && alert.info[0].description}{'\n'}</Text>
                <Text style={styles.whiteBoldText}>Instructions:</Text>
                <Text style={styles.whiteText}>{alert.info && alert.info[0].instruction}{'\n'}</Text>
                <Text style={styles.whiteBoldText}>Area:</Text>
                <Text style={styles.whiteText}>{alert.info && alert.info[0].area?.areaDesc}</Text>
              </View>
              <View style={styles.content}>
                <Text style={styles.whiteLargeText}>Time period</Text>
                <FlatList data={getTimePeriodData(alert)} renderItem={item =>renderTimePeriodItem(item)} key={new Date().toISOString()}/>
              </View>
              <View style={styles.content}>
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
              <View style={{marginBottom: 20}}></View>
            </>
          )}
        />
      </View>
    )
  }

  return (
    <SafeAreaView>
      <View style={styles.wrapper}>
        <ImageBackground source={appBackground} style={styles.bg}>
          <AppBar location={location} />
          { mainContent }
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
  },
  contentContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0,
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
    backgroundColor: 'rgba(217, 217, 217, 0.5)',
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
