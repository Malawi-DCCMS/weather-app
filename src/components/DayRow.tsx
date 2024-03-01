import { StyleSheet, View } from "react-native";
import { Icon, Paragraph, Text } from "react-native-paper";

import weatherIcons from '../constants/weathericons.constant';
import { WEATHER_WARNINGS } from "../common";
import { DaySummary } from "../utils/weatherData";
import { GlassView } from '../components/GlassView';


type DayRowProps = {
  summary: DaySummary;
}
const DayRow = (props: DayRowProps) => {
  const { summary } = props;

  const minTemp = summary.maxTemperature || 0;
  const maxTemp = summary.minTemperature || 0;
  const windSpeed = summary.windSpeed || 0;
  const icon = summary.weatherSymbol || 'snow'

  return (
    <GlassView glassStyle={styles.dayRow} blurStyle={{ blurAmount: 8, blurType: 'light' }}>
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
          <Text style={styles.whiteText}>{Math.round(minTemp)}&deg; - {Math.round(minTemp)}&deg;</Text>
        </Paragraph>
        <Paragraph style={{ flex: 2 }}><Text style={styles.whiteText}>{windSpeed}</Text></Paragraph>
      </View>
    </GlassView>
  )
};

const styles = StyleSheet.create({
  dayRow: {
    fontFamily: 'NotoSans-Regular',
    width: '100%',
    marginTop: 9,
    borderRadius: 4,
  },
  whiteText: {
    color: 'white',
    fontSize: 16,
  },
  opacity: {
    backgroundColor: 'rgba(217, 217, 217, .5)',
    width: '100%',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default DayRow;
