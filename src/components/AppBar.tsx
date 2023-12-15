import * as React from 'react';
import { Platform, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Icon, Menu } from 'react-native-paper';
import { ParamListBase, RouteProp, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { WEATHER_WARNINGS } from '../common';
import { SCREENS } from '../constants/screens.constant';
import backAndroid from '../../assets/icons8-arrow-back-48.png';
import backIOS from '../../assets/icons8-left-50.png';

type AppBarProps = {
  location: string,
  navigation: NativeStackNavigationProp<ParamListBase>,
  route?: RouteProp<ParamListBase>
};

const AppBar = (props: AppBarProps) => {
  const tooLong = props.location.length > 12;
  const fmtLocation = tooLong ? `${props.location?.slice(0, 12)}...` : props.location;

  const showSearch = useRoute().name !== SCREENS.search;
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);
  const backArrow = Platform.OS === 'ios' ? backIOS : backAndroid;
  const canGoBack = () => props.navigation.canGoBack();

  return (
    <>
      <View style={styles.appBar}>
        <View style={styles.appTitleContainer}>
          {canGoBack() && <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ paddingRight: 12 }}><Icon size={24} source={backArrow} /></TouchableOpacity>}
          <Text style={styles.appTitle}>{fmtLocation}</Text>
          <TouchableOpacity style={styles.weatherWarning}><Icon size={24} source={WEATHER_WARNINGS.yellow} /></TouchableOpacity>
        </View>

        <View style={styles.appNav}>
          {showSearch && <TouchableOpacity style={styles.items} onPress={() => props.navigation.navigate(SCREENS.search)}><Icon size={24} source="magnify" /></TouchableOpacity>}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Menu
              visible={visible}
              onDismiss={closeMenu} anchor={<TouchableOpacity onPress={() => openMenu()}><Icon size={24} source={visible ? "close" : "menu"} /></TouchableOpacity>}
              contentStyle={{ backgroundColor: 'white', marginTop: 25 }}
            >
              <Menu.Item onPress={() => { closeMenu(); }} style={styles.menuItem} title="Favourites" />
              <Menu.Item onPress={() => { closeMenu(); }} style={styles.menuItem} title="About the app" />
              <Menu.Item onPress={() => { closeMenu(); }} style={styles.menuItem} title="Settings" />
              <Menu.Item onPress={() => { closeMenu(); props.navigation.navigate(SCREENS.feedback); }} style={styles.menuItem} title="Give feedback" />
              <Menu.Item onPress={() => { closeMenu(); }} style={styles.menuItem} title="Help" />
            </Menu>
          </View>
        </View>
      </View>
    </>
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
  },
  menuItem: {
    paddingRight: 50,
    paddingLeft: 20,
  },
  weatherWarning: {
    paddingLeft: 12,
  },
});
