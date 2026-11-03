import React, { JSX, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text } from 'react-native-paper';
import { DateTime } from "luxon";
import { useTranslation } from 'react-i18next';

import DayRow from './DayRow';
import { ForecastRecord } from '@/lib/forecast/types';
import { getFiveDayWindow } from '@/lib/forecast/day-parts';
import { CAPAlert } from '@/lib/alerts/providers/cap-alerts/alert';
import { getAlertForDay } from '@/lib/alerts/providers/cap-alerts/plain-language';
import { ThemeColors, Fonts, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

type FiveDaysProps = {
    startDate: DateTime;
    forecast?: ForecastRecord;
    name: string;
    onClick: (day: DateTime) => void;
    // Alerts already filtered to the current location — each day checks
    // whether one overlaps its date and shows an inline chip if so.
    alerts?: CAPAlert[];
    onSelectAlert?: (alert: CAPAlert) => void;
}
function FiveDays(props: FiveDaysProps): JSX.Element {
    const { t } = useTranslation();
    const colors = useTheme();
    const styles = useMemo(() => makeStyles(colors), [colors]);
    const { startDate, forecast, alerts, onSelectAlert } = props

    if (forecast) {
        const fiveDays = getFiveDayWindow(forecast, startDate);

        if (fiveDays.length === 0) {
            return (
                <View style={styles.noForecast}>
                    <Text>
                        {t("forecast.error.unavailable")}
                    </Text>
                </View>
            );
        }

        return <View style={styles.fiveDaysWrapper}>
            {fiveDays.map((d, idx) => {
                const day = DateTime.fromISO(d.day);
                const dayAlert = alerts ? getAlertForDay(alerts, day) : undefined;

                return (
                    <TouchableOpacity key={d.day} onPress={() => props.onClick(day)}>
                        <DayRow
                            summary={d}
                            isTomorrow={idx === 0}
                            alert={dayAlert}
                            onSelectAlert={dayAlert ? () => onSelectAlert?.(dayAlert) : undefined}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    }

    return (
        <View style={styles.loading}>
            <Text>{t("common.states.loading")}...</Text>
        </View>
    );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
    noForecast: {
        fontFamily: Fonts.sans.regular,
        color: colors.text,
        paddingLeft: Spacing.md,
        paddingRight: Spacing.md,
        marginTop: Spacing.xxl,
    },
    loading: {
        fontFamily: Fonts.sans.regular,
        color: colors.text,
        paddingLeft: Spacing.md,
        paddingRight: Spacing.md,
        marginTop: Spacing.xxl,
    },
    fiveDaysWrapper: {
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.sm,
        paddingBottom: Spacing.md,
    },
});

export default FiveDays;
