import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import moment from 'moment';

import { ForecastTimestep, WeatherForecast } from '../utils/locationforecast';
import DayRow from './DayRow';

type GroupedForecasts = Record<string, Array<ForecastTimestep>>;
function groupForecastsByDay(
    forecasts: Array<ForecastTimestep>,
): GroupedForecasts {
    return forecasts.reduce((acc: GroupedForecasts, val) => {
        const key = moment(val.time).format('YYYY-MM-DD');
        !acc[key] && (acc[key] = []);
        acc[key].push(val);
        return acc;
    }, {});
}

type DailyForecastProps = {
    forecast?: WeatherForecast;
    name: string;
    onClick: (forecast: Array<ForecastTimestep>) => void;
}
function FiveDays(props: DailyForecastProps): JSX.Element {
    if (props.forecast) {
        const { timeseries } = props.forecast.properties;
        const today = moment().format('YYYY-MM-DD');
        const filtered = timeseries.filter(t => moment(t.time).format('YYYY-MM-DD') !== today);
        const grouped = groupForecastsByDay(filtered);
        const fiveDayForecast = Object.entries(grouped).slice(0, 5);
        return <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 40 }}>
            {fiveDayForecast.map(([k, val]) => <TouchableOpacity key={k} onPress={() => props.onClick(val)}><DayRow day={k} forecast={val} /></TouchableOpacity>)}
        </View>
    }

    return (
        <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 40 }}>
            <Text style={{ fontFamily: 'NotoSans-Regular' }}>Loading...</Text>
        </View>
    );
};

export default FiveDays;
