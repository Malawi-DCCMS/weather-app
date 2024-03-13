import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Paragraph, Text } from 'react-native-paper';
import { DateTime } from "luxon";

import DayRow from './DayRow';
import { Forecast } from '../utils/weatherData';
import { WEATHER_WARNINGS } from '../common';
import weatherIcons from '../constants/weathericons.constant';

type DailyForecastProps = {
    startDate: DateTime;
    preparedForecast?: Forecast;
    name: string;
    onClick: (day: DateTime, preparedForecast: Forecast) => void;
}
function FiveDays(props: DailyForecastProps): JSX.Element {
    const { startDate, preparedForecast } = props

    if (preparedForecast) {
        const allDays = preparedForecast.days()
        const startIndex = allDays.findIndex(day => startDate.hasSame(day, "day"))

        if (startIndex == -1) {
            return (
                <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 40 }}>
                    <Text style={{ fontFamily: 'NotoSans-Regular' }}>
                        Forecast not available at the moment. Please try again later.
                    </Text>
                </View>
            );
        }

        const fiveDays = allDays.slice(startIndex, startIndex+5)
        return <View style={{ paddingLeft: 27, paddingRight: 26, marginTop: 60, paddingBottom: 50 }}>
            <View style={styles.dayRow}>
                <View style={styles.opacity}>
                    <Paragraph style={{ flex: 3 }}>
                        <Text style={styles.transparentText}>Sun</Text>
                    </Paragraph>
                    <Paragraph style={{ flex: 3 }}>
                        <Icon source={weatherIcons['fair_day']} color='rgba(255, 255, 255, 0)' size={28} />
                    </Paragraph>
                    <Paragraph style={{ flex: 3 }}>
                        <Text style={styles.whiteText}>Min</Text>
                    </Paragraph>
                    <Paragraph style={{ flex: 3 }}>
                        <Text style={styles.whiteText}>Max</Text>
                    </Paragraph>
                    <Paragraph style={{ flex: 2 }}><Text style={styles.whiteText}>Km/h</Text></Paragraph>
                </View>
            </View>
            {fiveDays.map(day =>
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

const styles = StyleSheet.create({
    dayRow: {
        fontFamily: 'NotoSans-Regular',
        backgroundColor: 'transparent',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    whiteText: {
        color: 'white',
        fontSize: 14,
        fontWeight: "300",
    },
    transparentText: {
        color: 'transparent',
        fontSize: 14,
        fontWeight: "300",
    },
    opacity: {
        backgroundColor: 'transparent',
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
});

export default FiveDays;
