import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Icon, Menu } from 'react-native-paper';
import { ParamListBase, RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSelector } from 'react-redux';

import { SCREENS } from '../constants/screens.constant';
import backArrow from '../../assets/icons8-back-100_2.png';
import { WEATHER_WARNINGS } from '../common';
import { RootState } from '../store';
import { CAPAlert, CAPInfo } from '../lib/cap-client/alert';

type AppBarProps = {
  location: string,
  navigation: NativeStackNavigationProp<ParamListBase>,
  route?: RouteProp<ParamListBase>
};

const getWarningIcons = (alerts: Array<CAPAlert>) => {
  if (alerts && alerts.length) {
    const icons: Array<React.JSX.Element> = [];
    for (let i = 0, j = 0; i < alerts.length; i += 1, j += 20) {
      const capInfo = alerts[i].info as Array<CAPInfo>;
      const alertColor = capInfo[0].warningColor().toLowerCase();
      const icon = WEATHER_WARNINGS[alertColor];
      icons.push(
        <TouchableOpacity key={i} style={{ position: 'relative', top: 0, right: j, zIndex: j }}>
          <Image style={{ width: 35, height: 30 }} source={icon} />
        </TouchableOpacity>
      );
    }
    return <View style={styles.warningIcons}>
      {icons}
    </View>;
  }
};

const AppBar = (props: AppBarProps) => {
  const tooLong = props.location.length > 15;
  const fmtLocation = tooLong ? `${props.location?.slice(0, 15)}...` : props.location;
  const { alerts } = useSelector((state: RootState) => state.alerts);
  const { lat, lon } = useSelector((state: RootState) => state.location);

  const showSearch = useRoute().name !== SCREENS.Search;
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useIsFocused();

  return (
    <View style={styles.appBar}>
      <View style={styles.appTitleContainer}>
        {props.navigation.canGoBack() && <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ paddingRight: 12 }}><Icon size={24} color='white' source={backArrow} /></TouchableOpacity>}
        <Text style={styles.appTitle}>{fmtLocation}</Text>
        {getWarningIcons(alerts[`${lat}${lon}`])}
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
            style={{ position: 'absolute', right: 0, width: 185 }}
            contentStyle={{ backgroundColor: 'rgba(217, 217, 217, .9)', marginTop: 25, padding: 0, shadowColor: 'rgba(217, 217, 217, .9)' }}
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                props.navigation.navigate(SCREENS.AboutUs);
              }}
              style={styles.menuItem}
              titleStyle={styles.menuItemTitle}
              title="About us"
            />
            {/* <Menu.Item
              onPress={() => {
                closeMenu();
                props.navigation.navigate(SCREENS.Feedback);
              }}
              style={styles.menuItem}
              titleStyle={styles.menuItemTitle}
              title="Give feedback"
            /> */}
          </Menu>
        </View>
      </View>
    </View>
  );
}

export default AppBar;

const styles = StyleSheet.create({
  appBar: {
    flexDirection: 'row',
    alignContent: 'center',
  },
  blurBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
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
    marginRight: 19,
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
  warningIcons: {
    flexDirection: 'row',
    flex: 1,
    height: 30,
  },
});
