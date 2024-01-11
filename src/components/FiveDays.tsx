import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { DateTime } from "luxon";
import DayRow from './DayRow';
import { Forecast } from '../utils/weatherData';

type DailyForecastProps = {
    preparedForecast?: Forecast;
    name: string;
    onClick: (day: DateTime, preparedForecast: Forecast) => void;
}
function FiveDays(props: DailyForecastProps): JSX.Element {

    const {preparedForecast} = props

    if (preparedForecast) {
        const days = Array.from(preparedForecast.days()).slice(1, 6)

        return <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 40 }}>
            {days.map(day =>
                <TouchableOpacity key={day.toLocaleString()} onPress={() => props.onClick(day, preparedForecast)}>
                    <DayRow summary={preparedForecast.atDay(day)} />
                </TouchableOpacity>
            )}
        </View>
    }

    return (
        <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 40 }}>
            <Text style={{ fontFamily: 'NotoSans-Regular' }}>Loading...</Text>
        </View>
    );
};

export default FiveDays;
