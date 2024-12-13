import React, { useMemo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { Icon, Menu } from 'react-native-paper';
import { ParamListBase, RouteProp, useIsFocused, useRoute } from '@react-navigation/native';
import { shallowEqual, useSelector } from 'react-redux';
import { useNavigation, useRouter, Href } from 'expo-router';

import { SCREENS } from '@/lib/layout/constants';
import { WEATHER_WARNING_ICONS } from '@/lib/alerts/icons';
import { RootState } from '@/lib/store';
import { CAPAlert, CAPInfo, alertInLocation, alertLevel } from '@/lib/alerts/alert';

const backArrow = require('@/assets/icons8-back-100_2.png');

type AppBarProps = {
  location: string,
  route?: RouteProp<ParamListBase>
};

const AppBar = (props: AppBarProps) => {
  const router = useRouter();
  const navigation = useNavigation();

  const { alerts } = useSelector((state: RootState) => state.alerts, shallowEqual);
  const { lat, lon } = useSelector((state: RootState) => state.location, shallowEqual);

  const showSearch = useRoute().name !== SCREENS.Search;
  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useIsFocused();

  let relevantAlerts: CAPAlert[] = []
  if(lat && lon){
    relevantAlerts =  alerts.filter(alert => alertInLocation(alert, {latitude:lat, longitude:lon}))
  }

  return useMemo(() => (
    <View style={styles.appBar}>
      <View style={styles.appTitleContainer}>
        {navigation.canGoBack() && 
        <TouchableOpacity accessible={true} accessibilityLabel='Go back' onPress={() => navigation.goBack()} style={{ paddingRight: 12 }}>
            <Icon size={24} color='white' source={backArrow} />
        </TouchableOpacity>}
        <Text style={styles.appTitle} numberOfLines={1}>{props.location || "Zanyengo"}</Text>
        {getWarningIcons(relevantAlerts)}
      </View>

      <View style={styles.appNav}>
        {showSearch && 
            <TouchableOpacity style={styles.items} accessible={true} accessibilityLabel='Search' 
                onPress={() => router.push(SCREENS.Search.toString() as Href)}>
                <Icon size={24} color='white' source="magnify" />
            </TouchableOpacity>
        }
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
          <Menu
            visible={visible}
            onDismiss={closeMenu} anchor={<TouchableOpacity accessible={true} accessibilityLabel={visible ? 'Close menu' : 'Open menu'} onPress={() => openMenu()}><Icon size={24} color='white' source={visible ? "close" : "menu"} /></TouchableOpacity>}
            style={{ position: 'absolute', right: 0, width: 185 }}
            contentStyle={{ backgroundColor: 'rgba(217, 217, 217, .9)', marginTop: 25, padding: 0, shadowColor: 'rgba(217, 217, 217, .9)' }}
          >
            <Menu.Item
              onPress={() => {
                closeMenu();
                router.push(SCREENS.AboutUs.toString() as Href);
              }}
              style={styles.menuItem}
              accessibilityLabel='About the developers'
              titleStyle={styles.menuItemTitle}
              title="About us"
            />
            <Menu.Item
              onPress={() => {
                closeMenu();
                router.push(SCREENS.AboutTheApp.toString() as Href);
              }}
              style={styles.menuItem}
              accessibilityLabel='About the app'
              titleStyle={styles.menuItemTitle}
              title="About the app"
            />
          </Menu>
        </View>
      </View>
    </View>
  ), [lat, lon, alerts, visible]);
}

const getWarningIcons = (alerts: Array<CAPAlert>) => {
    if (alerts && alerts.length) {
      const icons: Array<React.JSX.Element> = [];
      for (let i = 0, j = 0; i < alerts.length; i += 1, j += 20) {
        const capInfo = alerts[i].info as Array<CAPInfo>;
        const alertColor = alertLevel(capInfo[0]).toLowerCase();
        const icon = WEATHER_WARNING_ICONS[alertColor];
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
    flex: 1,
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
