import { StyleSheet, View } from "react-native";
import { Icon, Paragraph, Text } from "react-native-paper";
import weatherIcons from '../constants/weathericons.constant';
import { WEATHER_WARNINGS } from "../common";
import { DaySummary } from "../utils/weatherData";


type DayRowProps = {
  summary: DaySummary;
}
const DayRow = (props: DayRowProps) => {
  const { summary } = props;

  const minTemp = summary.maxTemperature || 0;
  const maxTemp = summary.minTemperature || 0;
  const windSpeed = summary.windSpeed || 0;
  const icon = summary.weatherSymbol || 'fair_day'

  return (
    <View style={styles.dayRow}>
      <Paragraph style={{ flex: 2 }}>
        <Text>{summary.day.toLocaleString({weekday: "short"})}</Text>
      </Paragraph>
      <Paragraph style={{ flex: 2 }}>
        <Icon source={WEATHER_WARNINGS['yellow']} size={19} />
      </Paragraph>
      <Paragraph style={{ flex: 2 }}>
        <Icon source={weatherIcons[icon]} size={19} />
      </Paragraph>
      <Paragraph style={{ flex: 3 }}>
        <Text>{Math.round(minTemp)}&deg; - {Math.round(maxTemp)}&deg;</Text>
      </Paragraph>
      <Paragraph style={{ flex: 2 }}><Text>{windSpeed} km/h</Text></Paragraph>
    </View>
  )
};

const styles = StyleSheet.create({
  dayRow: {
    fontFamily: 'NotoSans-Regular',
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 4,
    padding: 15,
    marginTop: 8,
    flexDirection: 'row',
    fontSize: 16,
    justifyContent: 'space-evenly',
  },
});

export default DayRow;
