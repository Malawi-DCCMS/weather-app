import React, { JSX } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { DateTime } from "luxon";

import DayRow from './DayRow';
import { WeatherData } from '@/lib/forecast/weatherData';
import weatherIcons from '@/lib/forecast/weathericons.constant';
import { useTranslation } from 'react-i18next';
import i18n from '@/lib/localization/i18n';

type FiveDaysProps = {
    startDate: DateTime;
    preparedForecast?: WeatherData;
    name: string;
    onClick: (day: DateTime) => void;
}
function FiveDays(props: FiveDaysProps): JSX.Element {
    const { t } = useTranslation();
    const { startDate, preparedForecast } = props

    if (preparedForecast) {
        const allDays = preparedForecast.days()
        const startIndex = allDays.findIndex(day => startDate.hasSame(day, "day"))

        if (startIndex == -1) {
            return (
                <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 40 }}>
                    <Text style={{ fontFamily: 'NotoSans-Regular' }}>
                        {t('Forecast not available at the moment. Please try again later.')}
                    </Text>
                </View>
            );
        }

        const fiveDays = allDays.slice(startIndex, startIndex + 5)
        return <View style={{ paddingLeft: 27, paddingRight: 26, marginTop: 60, paddingBottom: 50 }}>
            {fiveDays.map(day =>
                <TouchableOpacity key={day.toLocaleString()} onPress={() => props.onClick(day)}>
                    <DayRow summary={preparedForecast.atDay(day)} />
                </TouchableOpacity>
            )}
        </View>
    }

    return (
        <View style={{ paddingLeft: 12, paddingRight: 12, marginTop: 40 }}>
            <Text style={{ fontFamily: 'NotoSans-Regular' }}>{t('Loading')}...</Text>
        </View>
    );
};

function FiveDayHeader() {
    const { t } = useTranslation();

    return (
        <View style={styles.dayRow}>
            <View style={styles.opacity}>
                <Text variant="bodyMedium" style={{ flex: 3 }}>
                    <Text style={styles.transparentText}>Sun</Text>
                </Text>
                <Text variant="bodyMedium" style={{ flex: 2 }}>
                    <Icon source={weatherIcons['fair_day']} color='rgba(255, 255, 255, 0)' size={28} />
                </Text>
                <Text variant="bodyMedium" style={{ flex: i18n.language === 'en' ? 3 : 4 }}>
                    <Text style={styles.whiteText}>{t('Min')}</Text>
                </Text>
                <Text variant="bodyMedium" style={{ flex: i18n.language === 'en' ? 3 : 4 }}>
                    <Text style={styles.whiteText}>{t('Max')}</Text>
                </Text>
                <Text variant="bodyMedium" style={{ flex: 3 }}><Text style={styles.whiteText}>Km/h</Text></Text>
            </View>
        </View>
    )
}

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
        textAlign: 'center',
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
