import { StyleSheet, View } from "react-native";
import { Icon, Paragraph, Text } from "react-native-paper";
import moment from "moment";

import weatherIcons from '../constants/weathericons.constant';
import { WEATHER_WARNINGS } from "../common";
import { ForecastTimestep } from "../utils/locationforecast";
import { getWeatherIconAtDay } from "../utils/forecast.utils";


type DayRowProps = {
  day: string;
  forecast: Array<ForecastTimestep>;
}
const DayRow = (props: DayRowProps) => {
  const day = moment(props.day).format('ddd');
  const { forecast } = props;

  const temps = forecast.map(t => t.data.instant.details.air_temperature || 0);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const windSpeed = Math.max(...(forecast.map(t => t.data.instant.details.wind_speed || 0)));
  const icon = getWeatherIconAtDay(forecast);

  return (
    <View style={styles.dayRow}>
      <Paragraph style={{ flex: 2 }}>
        <Text>{day}</Text>
      </Paragraph>
      <Paragraph style={{ flex: 2 }}>
        <Icon source={WEATHER_WARNINGS['yellow']} size={19} />
      </Paragraph>
      <Paragraph style={{ flex: 2 }}>
        <Icon source={weatherIcons[icon || 'fair_day']} size={19} />
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
