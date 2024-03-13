import React from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon, Menu } from 'react-native-paper';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BlurView } from '@react-native-community/blur';

import { WEATHER_WARNINGS } from '../common';
import { SCREENS } from '../constants/screens.constant';
import backArrow from '../../assets/icons8-back-100_2.png';

type AppBarProps = {
  location: string,
  navigation: NativeStackNavigationProp<ParamListBase>,
  route?: RouteProp<ParamListBase>
};

const AppBar = (props: AppBarProps) => {
  const tooLong = props.location.length > 15;
  const fmtLocation = tooLong ? `${props.location?.slice(0, 10)}...` : props.location;

  const showSearch = useRoute().name !== SCREENS.Search;
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <View style={styles.appBar}>
      <View style={styles.appTitleContainer}>
        {props.navigation.canGoBack() && <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ paddingRight: 12 }}><Icon size={24} color='white' source={backArrow} /></TouchableOpacity>}
        <Text style={styles.appTitle}>{fmtLocation}</Text>
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
      <BlurView blurAmount={50} blurType='light' style={styles.blurBar} />
    </View>
  );
}

export default AppBar;

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
  },
  blurBar: {
    flex: 1,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 12,
    paddingBottom: 12,
    position: 'absolute',
    top: 0,
    width: '100%',
    height: '100%',
    zIndex: 0,
  },
  appTitleContainer: {
    paddingRight: 13,
    paddingLeft: 13,
    paddingTop: 17,
    paddingBottom: 17,
    flex: 7,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 1,
  },
  appTitle: {
    fontSize: 20,
    fontFamily: 'NotoSans-Regular',
    color: 'white',
    marginRight: 5,
  },
  appNav: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 1,
    paddingRight: 20,
    paddingLeft: 20,
    paddingTop: 12,
    paddingBottom: 12,
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
