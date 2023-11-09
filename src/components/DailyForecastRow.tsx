import { StyleSheet, View } from "react-native";
import { Icon, Paragraph, Text } from "react-native-paper";
import moment from "moment";

import weatherIcons from '../constants/weathericons';
import { WEATHER_WARNINGS } from "../common";
import { ForecastTimestep } from "../utils/locationforecast";

function getWeatherIcon(timesteps: Array<ForecastTimestep>): string | undefined {
  const today = moment().format('YYYY-MM-DD');
  const timeIsAfter4 = moment().isAfter(moment(`${today} 04:00:00Z`));
  const timeIsAfter6 = moment().isAfter(moment(`${today} 06:00:00Z`));
  let icon = undefined;

  if (timeIsAfter4) {
      const timestep = timesteps.find(t => t.time = `${today} 04:00:00Z`);
      icon = timestep?.data.next_12_hours?.summary?.symbol_code;
  }

  if (timeIsAfter6) {
      const timestep = timesteps.find(t => t.time = `${today} 06:00:00Z`);
      icon = timestep?.data.next_12_hours?.summary?.symbol_code;
  }

  return icon;
}

type DailyForecastRowProps = {
  day: string;
  forecast: Array<ForecastTimestep>;
}
const DailyForecastRow = (props: DailyForecastRowProps) => {
  const day = moment(props.day).format('ddd');
  const { forecast } = props;

  const temps = forecast.map(t => t.data.instant.details.air_temperature || 0);
  const minTemp = Math.min(...temps);
  const maxTemp = Math.max(...temps);
  const windSpeed = Math.max(...(forecast.map(t => t.data.instant.details.wind_speed || 0)));
  const icon = getWeatherIcon(forecast);

  return (
    <View style={styles.dailyForecastRow}>
      <Paragraph style={{ flex: 2 }}>
        <Text>{day}</Text>
      </Paragraph>
      <Paragraph style={{ flex: 2 }}>
        <Icon source={WEATHER_WARNINGS['yellow']} size={19} />
      </Paragraph>
      <Paragraph style={{ flex: 2 }}>
        <Icon source={weatherIcons[icon || 'fair_day']} size={19} />
      </Paragraph>
      <Paragraph style={{ flex: 3, justifyContent: 'space-evenly' }}>
        <Text>{minTemp}&deg; - {maxTemp}&deg;</Text>
      </Paragraph>
      <Paragraph style={{ flex: 2, textAlign: 'right' }}><Text>{windSpeed} km/h</Text></Paragraph>
    </View>
  )
};

const styles = StyleSheet.create({
  dailyForecastRow: {
    fontFamily: 'NotoSans-Regular',
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
