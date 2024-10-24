import { StyleSheet, View } from "react-native";
import React from "react";

import { CAPAlert, alertInLocation } from "../lib/cap-client/alert";
import { useSelector } from 'react-redux';
import type { RootState } from '../store'

import WeatherAlert from "./WeatherAlert";
import { SCREENS } from "../constants/screens.constant";
import { FadeIn } from "./FadeIn";


type AlertsProps = {
  lat: number | undefined,
  lon: number | undefined,
  location: string,
  navigator: any,
}
const Alerts = (props: AlertsProps) => {
  const { lat, lon, navigator, location } = props;
  const { alerts } = useSelector((state: RootState) => state.alerts);

  const onSelectWarning = (location: string, alertID: string) => navigator.navigate(SCREENS.WeatherWarning, { location, alertID });

  let relevantAlerts: CAPAlert[] = []
  if(lat && lon){
    relevantAlerts =  alerts.filter(alert => alertInLocation(alert, {latitude:lat, longitude:lon}))
  }

  if (relevantAlerts.length > 0) {
    return (
      <FadeIn style={{}}>
        <View style={styles.alertsRow}>
          {relevantAlerts.map((alert, idx) => <WeatherAlert key={idx} alert={alert} onPress={() => onSelectWarning(location, alert.identifier)} />)}
        </View>
      </FadeIn>
    )
  }

  return <></>
};

const styles = StyleSheet.create({
  alertsRow: {
    width: '100%',
  },
});

export default Alerts;
