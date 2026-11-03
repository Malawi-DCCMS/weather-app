import React, { JSX, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Icon } from 'react-native-paper';
import { DateTime } from "luxon";
import { useTranslation } from 'react-i18next';

import weatherIcons from '@/lib/forecast/weathericons.constant';
import { ForecastDayRecord } from '@/lib/forecast/types';
import { WEEKDAY_LABEL_KEYS } from '@/lib/forecast/day-parts';
import { ThemeColors, Fonts, Radius, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';
import { useUnits } from '@/lib/hooks/use-units';
import { PRECIPITATION_SYMBOLS } from '@/lib/units';

type HourlyTableProps = {
  title: string;
  daySummary: ForecastDayRecord;
  day: DateTime;
};

function HourlyTable(props: HourlyTableProps): JSX.Element {
  const { t } = useTranslation();
  const units = useUnits();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const isSameDay = props.day.hasSame(DateTime.local(), "day");
  const dayName = isSameDay ? t("time.today") : t(WEEKDAY_LABEL_KEYS[props.day.weekday] ?? '');
  const rainWord = t("weather.rain").toLowerCase();
  const windWord = t("weather.wind").toLowerCase();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.headerText}>{dayName}</Text>
        </View>
        {props.daySummary.steps.map((step, idx) => {
          const stepTime = DateTime.fromISO(step.time);
          const timeLabel = stepTime.toFormat('h a').toLowerCase();
          const precipText = typeof step.precipitation === 'number' && step.precipitation > 0
            ? units.rain(step.precipitation)
            : `— ${PRECIPITATION_SYMBOLS[units.prefs.precipitation]}`;
          const windText = units.wind(step.windSpeed);
          const temp = units.temp(step.temperature);

          return (
            <View
              key={step.time}
              style={[styles.row, idx === props.daySummary.steps.length - 1 && styles.rowLast]}
              accessible={true}
              accessibilityLabel={`${timeLabel}: ${step.weatherSymbol.split('_').join(' ')}, ${precipText} ${rainWord}, ${windText} ${windWord}${step.temperature !== undefined ? `, ${units.tempSpoken(step.temperature)}` : ''}.`}
            >
              <View style={styles.leftGroup}>
                <Icon source={weatherIcons[step.weatherSymbol]} size={26} />
                <Text style={styles.time}>{timeLabel}</Text>
              </View>
              <Text style={styles.description} numberOfLines={2}>
                {precipText} {rainWord} · {windText} {windWord}
              </Text>
              <Text style={styles.temp}>{temp}</Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgAlt,
  },
  contentContainer: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
  card: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.large,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgMuted,
  },
  headerText: {
    fontSize: 16,
    color: colors.textStrong,
    fontFamily: Fonts.sans.bold,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
    minHeight: 48,
    borderBottomWidth: 1,
    borderBottomColor: colors.bgMuted,
  },
  rowLast: {
    borderBottomWidth: 0,
  },
  leftGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    minWidth: 84,
  },
  time: {
    fontSize: 15,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
  },
  description: {
    flex: 1,
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    color: colors.textSubtle,
  },
  temp: {
    fontSize: 18,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
    minWidth: 44,
    textAlign: 'right',
  },
});

export default HourlyTable;
