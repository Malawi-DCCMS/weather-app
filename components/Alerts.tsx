import { StyleSheet, View } from "react-native";
import React from "react";
import { useRouter, Href } from "expo-router";

import { useAlertsQuery } from "@/lib/hooks/alerts.hook";
import { SCREENS } from "@/lib/layout/constants";
import { CAPAlert, alertInLocation, alertLevel } from "@/lib/alerts/providers/cap-alerts/alert";
import { ALERT_SEVERITY_RANK } from "@/lib/alerts/providers/cap-alerts/icons";
import WeatherAlert from "./WeatherAlert";
import { FadeIn } from "./FadeIn";

type AlertsProps = {
  lat: number | undefined,
  lon: number | undefined,
  location: string,
}

const Alerts = (props: AlertsProps) => {
  const { lat, lon, location } = props;
  const { data: alerts = [] } = useAlertsQuery();

  const router = useRouter();

  const onSelectWarning = (location: string, alertID: string) => router.push({
        pathname: SCREENS.WeatherWarning, params: { location, alertID }
      });

  let relevantAlerts: CAPAlert[] = []
  if(lat && lon){
    relevantAlerts =  alerts.filter(alert => alertInLocation(alert, {latitude:lat, longitude:lon}))
  }

  if (relevantAlerts.length > 0) {
    // Worst-severity alert leads the banner. With more than one active
    // alert, the banner consolidates into a single "+N more warnings"
    // summary that opens the Warnings tab, rather than stacking one banner
    // per alert or picking an arbitrary one to deep-link into.
    const sorted = [...relevantAlerts].sort((a, b) => {
      const aInfo = a.info?.[0];
      const bInfo = b.info?.[0];
      const aRank = aInfo ? ALERT_SEVERITY_RANK[alertLevel(aInfo)] : Infinity;
      const bRank = bInfo ? ALERT_SEVERITY_RANK[alertLevel(bInfo)] : Infinity;
      return aRank - bRank;
    });

    const primary = sorted[0];
    const extraCount = sorted.length - 1;

    return (
      <FadeIn style={{}}>
        <View style={styles.alertsRow}>
          <WeatherAlert
            alert={primary}
            extraCount={extraCount}
            onPress={() => extraCount > 0 ? router.push('/Warnings' as Href) : onSelectWarning(location, primary.identifier)}
          />
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
