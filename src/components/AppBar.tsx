import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { ParamListBase } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { WEATHER_WARNINGS } from '../common';
import { SCREENS } from '../constants/screens.constant';

type AppBarProps = { location: string, navigation: DrawerNavigationProp<ParamListBase>; };

const AppBar = (props: AppBarProps) => {
  const tooLong = props.location.length > 15;
  const fmtLocation = tooLong ? `${props.location?.slice(0, 12)}...` : props.location;
  return (
    <View style={styles.appBar}>
      <View onTouchEnd={() => props.navigation.navigate(SCREENS.home)} style={styles.appTitleContainer}>
        <Text style={styles.appTitle}>{fmtLocation}</Text>
        <Icon size={24} source={WEATHER_WARNINGS.yellow} />
      </View>
      <View style={styles.appNav}>
        <View style={styles.items} onTouchStart={() => props.navigation.navigate(SCREENS.search)}><Icon size={24} source="magnify" /></View>
        <View onTouchStart={() => props.navigation.openDrawer()}><Icon size={24} source="menu" /></View>
      </View>
    </View>
  );
}

export default AppBar;

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 12,
    paddingBottom: 12,
    backgroundColor: '#E4E5D6',
  },
  appTitleContainer: {
    flex: 7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  appTitle: {
    fontSize: 28,
    fontFamily: 'NotoSans-Regular',
    color: '#323232',
    marginRight: 5,
  },
  appNav: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  items: {
    paddingRight: 15,
  }
});
