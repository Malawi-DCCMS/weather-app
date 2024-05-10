import { StyleSheet, View } from "react-native";
import React from "react";

import { CAPAlert } from "../lib/cap-client/alert";
import WeatherAlert from "./WeatherAlert";
import { SCREENS } from "../constants/screens.constant";
import { FadeIn } from "./FadeIn";


type AlertsProps = {
  alerts?: Array<CAPAlert>
  location: string,
  navigator: any,
}
const Alerts = (props: AlertsProps) => {
  const { alerts, navigator, location } = props;

  const onSelectWarning = (location: string, alert: CAPAlert) => navigator.navigate(SCREENS.WeatherWarning, { location, alert });

  if (alerts && alerts.length) {
    return (
      <FadeIn style={{}}>
        <View style={styles.alertsRow}>
          {alerts.map((alert, idx) => <WeatherAlert key={idx} alert={alert} onPress={() => onSelectWarning(location, alert)} />)}
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
