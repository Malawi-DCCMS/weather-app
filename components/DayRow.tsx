import React from "react";
import { StyleSheet, View } from "react-native";
import { Icon, Paragraph, Text } from "react-native-paper";

import weatherIcons from '@/lib/forecast/weathericons.constant';
import { WeatherDataDaySummary } from "@/lib/forecast/weatherData";
import { useTranslation } from "react-i18next";


type DayRowProps = {
  summary: WeatherDataDaySummary | undefined;
}
const DayRow = (props: DayRowProps) => {
  const { t } = useTranslation();
  const { summary } = props;

  if (!summary) {
    return (
      <View style={styles.dayRow}>
        <View style={styles.opacity}>
          <Paragraph style={{ flex: 2 }}>
            <Text style={styles.whiteText}>{t('Forecast unavailable')}.</Text>
          </Paragraph>
        </View>
      </View>
    )
  }


  const minTemp = summary.minTemperature || 0;
  const maxTemp = summary.maxTemperature || 0;
  const windSpeed = summary.windSpeed || 0;
  const icon = summary.weatherSymbol || 'snow'

  return (
    <View style={styles.dayRow}>
      <View style={styles.opacity}>
        <Paragraph style={{ flex: 3 }}>
          <Text style={styles.whiteText}>{summary.day.toLocaleString({ weekday: "short" })}</Text>
        </Paragraph>
        <View style={{ flex: 3, margin: -5 }} accessible={true} accessibilityLabel={`Weather symbol on ${summary.day.toLocaleString({ weekday: "short" })} is ${icon.split('_').join(' ')}.`}>
          <Icon source={weatherIcons[icon]} size={36} />
        </View>
        <Paragraph style={{ flex: 3 }}>
          <Text style={styles.whiteText}>{Math.round(minTemp)}&deg;</Text>
        </Paragraph>
        <Paragraph style={{ flex: 3 }}>
          <Text style={styles.whiteText}>{Math.round(maxTemp)}&deg;</Text>
        </Paragraph>
        <Paragraph style={{ flex: 2 }}><Text style={styles.whiteText}>{Math.round(windSpeed)}</Text></Paragraph>
      </View>
    </View>
  )
};

const styles = StyleSheet.create({
  dayRow: {
    fontFamily: 'NotoSans-Regular',
    width: '100%',
    marginTop: 9,
  },
  whiteText: {
    color: 'white',
    fontSize: 16,
    zIndex: 1,
  },
  opacity: {
    backgroundColor: 'rgba(217, 217, 217, .5)',
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderRadius: 4,
  },
});

export default DayRow;
