import { StyleSheet, View } from "react-native";
import React from "react";
import { useRouter } from "expo-router";  
import { shallowEqual, useSelector } from "react-redux";

import { RootState } from "@/lib/store";
import { CAPAlert, alertInLocation } from "@/lib/alerts/alert";
import WeatherAlert from "./WeatherAlert";
import { FadeIn } from "./FadeIn";

type AlertsProps = {
  lat: number | undefined,
  lon: number | undefined,
  location: string,
}

const Alerts = (props: AlertsProps) => {
  const { lat, lon, location } = props;
  const { alerts } = useSelector((state: RootState) => state.alerts, shallowEqual);

  const router = useRouter();

  const onSelectWarning = (location: string, alertID: string) => router.push({
        pathname: "/WeatherWarning", params: { location, alertID }
      });

  let relevantAlerts: CAPAlert[] = []
  if(lat && lon){
    relevantAlerts =  alerts.filter(alert => alertInLocation(alert, {latitude:lat, longitude:lon}))
  }

  if (relevantAlerts.length > 0) {
    return (
      <FadeIn style={{}}>
        <View style={styles.alertsRow}>
          {relevantAlerts.map((alert, idx) => <WeatherAlert key={idx} alert={alert} 
            onPress={() => onSelectWarning(location, alert.identifier)} />)
          }
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
