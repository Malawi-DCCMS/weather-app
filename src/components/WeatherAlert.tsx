import React from "react";
import { Image, ImageSourcePropType, StyleProp, StyleSheet, TouchableOpacity, View, ImageBackground } from "react-native";
import { Text } from "react-native-paper";

import weatherIcons from '../constants/weathericons.constant';
import warningBg from '../../assets/warning-bg.png';


function getWarningIcon(severity?: string): ImageSourcePropType {
  return weatherIcons['icon_warning_wind_red'];
}

function getWarningColor(severity?: string): string {
  return 'rgba(198, 0, 0, 0.60)';
}

type WeatherAlertProps = {
  alert?: {};
  style?: StyleProp<{}>,
  onPress: (alert: {}) => void
}
const WeatherAlert = (props: WeatherAlertProps) => {
  const { onPress } = props;

  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => onPress({})}>
      <View style={styles.glassWrapper}>
        <View style={{ ...styles.opacity, backgroundColor: getWarningColor() }}>
          <View style={styles.warning}>
            <ImageBackground source={warningBg} style={styles.warningIcon}><Image source={getWarningIcon()} style={styles.icon} /></ImageBackground>
            <View style={styles.warningText}><Text style={styles.header}>Expected: Extreme rainfall{'\n'}Level: red</Text></View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    marginTop: 0,
  },
  glassWrapper: {
    width: '100%',
  },
  opacity: {
    width: '100%',
    zIndex: 1,
    borderRadius: 4,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 10,
    paddingRight: 17,
    paddingLeft: 17,
    paddingTop: 7,
    paddingBottom: 11,
  },
  warning: {
    flexDirection: 'row',
  },
  warningIcon: {
    flex: 1,
    marginRight: 12,
    height: 50,
    width: 50,
  },
  icon: {
    width: 35,
    height: 30,
    position: 'absolute',
    top: 6,
    bottom: 14,
    left: 7,
    right: 7,
  },
  warningText: {
    flex: 6,
    paddingTop: 3,
  },
  header: {
    fontSize: 16,
    fontFamily: 'NotoSans-Regular',
    color: 'white',
    fontWeight: "400",
  },
});

export default WeatherAlert;
