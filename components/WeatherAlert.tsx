import React from "react";
import { Image, ImageSourcePropType, StyleProp, StyleSheet, TouchableOpacity, View, ImageBackground } from "react-native";
import { Text } from "react-native-paper";
import { DateTime } from "luxon";

import { CAPAlert, alertLevel } from '@/lib/alerts/alert';
import { WARNING_COLORS, WEATHER_WARNING_ICONS } from "@/lib/alerts/icons";

const warningBg = require('@/assets/warning-bg.png')

type WeatherAlertProps = {
  alert: CAPAlert;
  style?: StyleProp<{}>,
  onPress: (alert: {}) => void
}
const WeatherAlert = (props: WeatherAlertProps) => {
  const { alert, onPress } = props;

  return (
    <TouchableOpacity style={styles.wrapper} onPress={() => onPress({})}>
      <View style={styles.glassWrapper}>
        <View style={{ ...styles.opacity, backgroundColor: getWarningColor(getAlertLevel(alert)) }}>
          <View style={styles.warning}>
            <ImageBackground source={warningBg} style={styles.warningIcon}><Image source={getWarningIcon(getAlertLevel(alert) as string)} style={styles.icon} /></ImageBackground>
            <View style={styles.warningText}>
              <Text style={styles.header}>
                {getAlertStatus(alert)}: {getAlertEvent(alert)}{'\n'}Level: {getAlertLevel(alert)?.toLowerCase()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
};


function getWarningIcon(level: string): ImageSourcePropType {
  return WEATHER_WARNING_ICONS[level.toLowerCase()];
}

function getWarningColor(level?: keyof typeof WARNING_COLORS): string | undefined {
  if (!level) {
    return;
  }
  return WARNING_COLORS[level];
}

function getAlertStatus(alert: CAPAlert) {
  if (!alert.info || !alert.info.length) {
    return;
  }

  const { onset, effective } = alert.info[0];
  const start = DateTime.fromISO(onset || effective || alert?.sent);
  return start <= DateTime.now() ? 'Ongoing' : 'Expected';
}

function getAlertEvent(alert: CAPAlert) {
  if (!alert.info || !alert.info.length || !alert.info[0].event) {
    return;
  }
  return alert.info[0].event;
}

function getAlertLevel(alert: CAPAlert) {
  if (!alert.info || !alert.info.length) {
    return;
  }
  return alertLevel(alert.info[0]);
}

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
