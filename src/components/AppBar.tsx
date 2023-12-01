import * as React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Icon, Menu } from 'react-native-paper';
import { ParamListBase } from '@react-navigation/native';
import { DrawerNavigationProp } from '@react-navigation/drawer';

import { WEATHER_WARNINGS } from '../common';
import { SCREENS } from '../constants/screens.constant';

type AppBarProps = { location: string, navigation: DrawerNavigationProp<ParamListBase>; };

const AppBar = (props: AppBarProps) => {
  const tooLong = props.location.length > 15;
  const fmtLocation = tooLong ? `${props.location?.slice(0, 18)}...` : props.location;
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <>
      <View style={styles.appBar}>
        <View onTouchEnd={() => props.navigation.navigate(SCREENS.home)} style={styles.appTitleContainer}>
          <Text style={styles.appTitle}>{fmtLocation}</Text>
          <Icon size={24} source={WEATHER_WARNINGS.yellow} />
        </View>

        <View style={styles.appNav}>
          <View style={styles.items} onTouchStart={() => props.navigation.navigate(SCREENS.search)}><Icon size={24} source="magnify" /></View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Menu
              visible={visible}
              onDismiss={closeMenu} anchor={<View onTouchStart={() => openMenu()}><Icon size={24} source="menu" /></View>}
              contentStyle={{ backgroundColor: 'white', marginTop: 25 }}
            >
              <Menu.Item onPress={() => { closeMenu(); }} style={styles.menuItem} title="Favourites" />
              <Menu.Item onPress={() => { closeMenu(); }} style={styles.menuItem} title="About the app" />
              <Menu.Item onPress={() => { closeMenu(); }} style={styles.menuItem} title="Settings" />
              <Menu.Item onPress={() => { props.navigation.navigate(SCREENS.feedback); closeMenu(); }} style={styles.menuItem} title="Give feedback" />
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
  }
});
