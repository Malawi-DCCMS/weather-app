import { StyleSheet, View } from "react-native";
import { Icon, Paragraph, Text } from "react-native-paper";
import { BlurView } from "@react-native-community/blur";

import weatherIcons from '../constants/weathericons.constant';
import { WEATHER_WARNINGS } from "../common";
import { DaySummary } from "../utils/weatherData";


type DayRowProps = {
  summary: DaySummary;
}
const DayRow = (props: DayRowProps) => {
  const { summary } = props;

  const minTemp = summary.minTemperature || 0;
  const maxTemp = summary.maxTemperature || 0;
  const windSpeed = summary.windSpeed || 0;
  const icon = summary.weatherSymbol || 'snow'

  return (
    <View style={styles.dayRow}>
      <View style={styles.opacity}>
        <Paragraph style={{ flex: 2 }}>
          <Text style={styles.whiteText}>{summary.day.toLocaleString({ weekday: "short" })}</Text>
        </Paragraph>
        <Paragraph style={{ flex: 2 }}>
          <Icon source={WEATHER_WARNINGS['yellow']} size={28} />
        </Paragraph>
        <Paragraph style={{ flex: 2 }}>
          <Icon source={weatherIcons[icon]} size={28} />
        </Paragraph>
        <Paragraph style={{ flex: 5 }}>
          <Text style={styles.whiteText}>{Math.round(minTemp)}&deg; - {Math.round(maxTemp)}&deg;</Text>
        </Paragraph>
        <Paragraph style={{ flex: 2 }}><Text style={styles.whiteText}>{windSpeed}</Text></Paragraph>
      </View>
      <BlurView blurAmount={8} blurType="light" />
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
