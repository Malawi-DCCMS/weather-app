import React, { useState } from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon, Menu } from 'react-native-paper';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { WEATHER_WARNINGS } from '../common';
import { SCREENS } from '../constants/screens.constant';
import backAndroid from '../../assets/icons8-back-android.png';
import backIOS from '../../assets/icons8-back-ios.png';
import { GlassView } from '../components/GlassView';

type AppBarProps = {
  location: string,
  navigation: NativeStackNavigationProp<ParamListBase>,
  route?: RouteProp<ParamListBase>
};

const AppBar = (props: AppBarProps) => {
  const tooLong = props.location.length > 12;
  const fmtLocation = tooLong ? `${props.location?.slice(0, 10)}...` : props.location;

  const showSearch = useRoute().name !== SCREENS.Search;
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const backArrow = Platform.OS === 'ios' ? backIOS : backAndroid;

  return (
      <GlassView style={styles.appBar} glassStyle={styles.appBar}>
        <View style={styles.appTitleContainer}>
          {props.navigation.canGoBack() && <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ paddingRight: 12 }}><Icon size={24} color='white' source={backArrow} /></TouchableOpacity>}
          <Text style={styles.appTitle}>{fmtLocation}</Text>
          <TouchableOpacity style={styles.weatherWarning}><Icon size={33} source={WEATHER_WARNINGS.yellow} /></TouchableOpacity>
        </View>

        <View style={styles.appNav}>
          {showSearch && <TouchableOpacity style={styles.items} onPress={() => props.navigation.navigate(SCREENS.Search)}><Icon size={24} color='white' source="magnify" /></TouchableOpacity>}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Menu
              visible={visible}
              onDismiss={closeMenu} anchor={<TouchableOpacity onPress={() => openMenu()}><Icon size={24} color='white' source={visible ? "close" : "menu"} /></TouchableOpacity>}
              contentStyle={{ backgroundColor: 'rgba(217, 217, 217, 0.7)', marginTop: 25 }}
            >
              <Menu.Item onPress={() => { closeMenu(); }} style={styles.menuItem} titleStyle={styles.menuItemTitle} title="Favourites" />
              <Menu.Item onPress={() => { closeMenu(); props.navigation.navigate(SCREENS.AboutUs); }} style={styles.menuItem} titleStyle={styles.menuItemTitle} title="About the app" />
              <Menu.Item onPress={() => { closeMenu(); }} style={styles.menuItem} titleStyle={styles.menuItemTitle} title="Settings" />
              <Menu.Item onPress={() => { closeMenu(); props.navigation.navigate(SCREENS.Feedback); }} style={styles.menuItem} titleStyle={styles.menuItemTitle} title="Give feedback" />
              <Menu.Item onPress={() => { closeMenu(); }} style={styles.menuItem} titleStyle={styles.menuItemTitle} title="Help" />
            </Menu>
          </View>
        </View>
      </GlassView>
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
    color: 'white',
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
  },
  menuItem: {
    paddingRight: 50,
    paddingLeft: 20,
    color: 'white',
  },
  menuItemTitle: {
    color: 'white',
  },
  weatherWarning: {
    paddingLeft: 12,
  },
});
