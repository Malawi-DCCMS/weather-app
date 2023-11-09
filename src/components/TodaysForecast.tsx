import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import moment from 'moment';
import { ForecastTimestep, WeatherForecast } from '../utils/locationforecast';

function getTodaysTimesteps(forecast: WeatherForecast): Array<ForecastTimestep> {
    const floor = moment(`${moment().subtract(1, 'days').format('YYYY-MM-DD')} 22:00:00`);
    const ceiling = moment(`${moment().format('YYYY-MM-DD')} 21:00:00`);
    return forecast.properties.timeseries.filter(f => moment(f.time).isBetween(floor, ceiling));
}

function sortTimesteps(timesteps: Array<ForecastTimestep>): Array<ForecastTimestep> {
    return timesteps.sort((first, second) => moment(first.time).isBefore(moment(second.time)) ? -1 : 1);
}

function getForecastDescription(timesteps: Array<ForecastTimestep>): string | undefined {
    const today = moment().format('YYYY-MM-DD');
    const timeIsBefore4 = moment().isBefore(moment(`${today} 04:00:00Z`));
    const timeIsBetween5and10 = moment().isBetween(moment(`${today} 05:00:00Z`), moment(`${today} 10:00:00Z`));
    const timeIsAfter11 = moment().isSameOrAfter(moment(`${today} 11:00:00Z`));
    let desc = undefined;

    if (timeIsBefore4) {
        const timestep = timesteps.find(t => t.time = `${today} 04:00:00Z`);
        desc = timestep?.data.next_12_hours?.summary?.symbol_code;
    }

    if (timeIsBetween5and10) {
        const timestep = timesteps.find(t => t.time = `${today} 10:00:00Z`);
        desc = timestep?.data.next_6_hours?.summary?.symbol_code;
    }

    if (timeIsAfter11) {
        const timestep = timesteps.find(t => t.time = `${today} 11:00:00Z`);
        desc = timestep?.data.next_1_hours?.summary?.symbol_code;
    }

    return desc ? desc.split('_').map(v => `${v[0].toUpperCase()}${v.substring(1)}`).join(' ') : desc;
}

type TodaysForecast = {
    temp?: number;
    maxTemp?: number;
    minTemp?: number;
    description?: string
};
function getTodaysForecast(timesteps: Array<ForecastTimestep>): TodaysForecast {
    const temps = timesteps.map(t => t.data.instant.details.air_temperature || 0);
    return {
        temp: timesteps[0].data.instant.details.air_temperature,
        minTemp: Math.min(...temps),
        maxTemp: Math.max(...temps),
        description: getForecastDescription(timesteps)
    };
}

type TodaysForecastProps = {
    forecast: WeatherForecast;
};
function TodaysForecast(props: TodaysForecastProps): JSX.Element {
    const timesteps = sortTimesteps(getTodaysTimesteps(props.forecast));
    const today = getTodaysForecast(timesteps);

    return (
        <View style={styles.container}>
            <Text style={styles.todaysHeader} onPress={() => { }}>Today &gt;</Text>
            <View style={{
                alignItems: 'center', flexDirection: 'row',
                justifyContent: 'space-between'
            }}>
                <Text style={styles.todaysForecastLarge}>{today.temp}&deg;</Text>
                <Text style={styles.todaysForecastSmall}>
                    &uarr; {today.maxTemp}&deg; &darr; {today.minTemp}&deg; {today.description || 'Not available'}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 61,
    },
    todaysHeader: {
        width: '85%',
        fontSize: 24,
        fontFamily: 'Rajdhani-Regular',
        textAlign: 'left',
        paddingLeft: 36,
    },
    todaysForecastLarge: {
        fontSize: 96,
        fontFamily: 'Rajdhani-Regular',
        flex: 4,
        textAlign: 'right',
    },
    todaysForecastSmall: {
        fontSize: 16,
        fontFamily: 'Rajdhani-Light',
        flex: 3,
        marginLeft: 2,
        textAlign: 'left',
    }
});

export default TodaysForecast;
