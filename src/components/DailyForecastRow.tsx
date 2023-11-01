import { StyleSheet, View } from "react-native";
import { Icon, Paragraph, Text } from "react-native-paper";

import weatherIcons from '../constants/weathericons';
import { WEATHER_WARNINGS } from "../common";

type DailyForecastRowProps = {
  forecast: {
    day: string;
    warning?: string;
    icon: string
    minTemp: number;
    maxTemp: number;
    windSpeed: number;
  }
}

const DailyForecastRow = (props: DailyForecastRowProps) => {
  return (
    <View style={styles.dailyForecastRow}>
      <Paragraph style={{ flex: 2 }}>
        <Text>{props.forecast.day}</Text>
      </Paragraph>
      <Paragraph style={{ flex: 2 }}>
        { props.forecast.warning?.length && <Icon source={WEATHER_WARNINGS[props.forecast.warning]} size={19} /> }
      </Paragraph>
      <Paragraph style={{ flex: 2 }}>
        <Icon source={weatherIcons[props.forecast.icon]} size={19} />
      </Paragraph>
      <Paragraph style={{ flex: 3, justifyContent: 'space-evenly' }}>
        <Text>{props.forecast.minTemp}&deg; - {props.forecast.maxTemp}&deg;</Text>
      </Paragraph>
      <Paragraph style={{ flex: 2, textAlign: 'right' }}><Text>{props.forecast.windSpeed} km/h</Text></Paragraph>
    </View>
  )
};

const styles = StyleSheet.create({
  dailyForecastRow: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 16,
    padding: 10,
    marginTop: 8,
    flexDirection: 'row',
    fontSize: 16,
    justifyContent: 'space-evenly',
  },
});

export default DailyForecastRow;
