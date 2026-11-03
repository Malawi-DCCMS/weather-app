import React, { useMemo } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";

import weatherIcons from "@/lib/forecast/weathericons.constant";
import { ForecastDayRecord } from "@/lib/forecast/types";
import { describeDaySummary, WEEKDAY_LABEL_KEYS } from "@/lib/forecast/day-parts";
import { CAPAlert, alertLevel } from "@/lib/alerts/providers/cap-alerts/alert";
import { ALERT_LEAD_WORD_KEYS, getWarningTintColors } from "@/lib/alerts/providers/cap-alerts/icons";
import { ThemeColors, Fonts, Radius, Spacing, touchTarget } from '@/lib/theme';
import { useTheme } from "@/lib/hooks/use-theme";
import { useUnits } from "@/lib/hooks/use-units";

type DayRowProps = {
  summary: ForecastDayRecord | undefined;
  // True only for the first row ("Tomorrow — Wednesday" instead of just "Wednesday").
  isTomorrow?: boolean;
  // A relevant alert whose window overlaps this day, if any — renders as an
  // inline chip below the row (e.g. "Warning: Strong Wind Warning").
  alert?: CAPAlert;
  onSelectAlert?: () => void;
};

const DayRow = ({ summary, isTomorrow, alert, onSelectAlert }: DayRowProps) => {
  const { t } = useTranslation();
  const units = useUnits();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  if (!summary) {
    return (
      <View style={styles.dayRow}>
        <View style={styles.card}>
          <Text style={styles.whiteText}>{t("forecast.states.unavailable")}.</Text>
        </View>
      </View>
    );
  }

  const minTemp = units.tempValue(summary.minTemperature || 0);
  const minTempText = units.temp(summary.minTemperature || 0);
  const maxTempText = units.temp(summary.maxTemperature || 0);
  const icon = summary.weatherSymbol;
  const iconSource = icon ? weatherIcons[icon] : undefined;
  const day = DateTime.fromISO(summary.day);
  const weekday = t(WEEKDAY_LABEL_KEYS[day.weekday] ?? '');
  const dayLabel = isTomorrow ? `${t('today.tomorrow')} — ${weekday}` : weekday;
  const description = describeDaySummary(t, summary);

  const alertInfo = alert?.info?.[0];
  const level = alertInfo ? alertLevel(alertInfo) : undefined;
  const tint = level ? getWarningTintColors(colors)[level] : undefined;

  return (
    <View style={styles.dayRow}>
      <View
        style={[styles.card, alertInfo && styles.cardWithChip]}
        accessible={true}
        accessibilityLabel={`${dayLabel}: ${description} ${minTemp} to ${units.tempSpoken(summary.maxTemperature || 0)}.`}
      >
        {iconSource && <Icon source={iconSource} size={40} />}
        <View style={styles.textBlock}>
          <Text style={styles.dayName}>{dayLabel}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        <View style={styles.rightBlock}>
          <Text style={styles.tempRange}>{minTempText} – {maxTempText}</Text>
          <Icon source="chevron-right" size={20} color={colors.textSubtle} />
        </View>
      </View>

      {alertInfo && level && tint &&
        <TouchableOpacity
          style={[styles.alertChip, { backgroundColor: tint.bg }]}
          onPress={onSelectAlert}
          accessibilityLabel={`${t(ALERT_LEAD_WORD_KEYS[level])}: ${alertInfo.event}`}
        >
          <Icon source="alert" size={18} color={tint.text} />
          <Text style={[styles.alertChipText, { color: tint.text }]} numberOfLines={1}>
            {t(ALERT_LEAD_WORD_KEYS[level])}: {alertInfo.event}
          </Text>
          <Icon source="chevron-right" size={18} color={tint.text} />
        </TouchableOpacity>
      }
    </View>
  );
};

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  dayRow: {
    fontFamily: Fonts.sans.regular,
    width: "100%",
    marginTop: Spacing.lg,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radius.large,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: colors.bg,
    width: '100%',
    padding: Spacing.lg,
    borderRadius: Radius.large,
    minHeight: touchTarget.nav,
  },
  cardWithChip: {
    borderBottomWidth: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  textBlock: {
    flex: 1,
    gap: 6,
  },
  rightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  whiteText: {
    color: colors.text,
    fontFamily: Fonts.sans.regular,
    fontSize: 14,
    textAlign: 'left'
  },
  dayName: {
    color: colors.textStrong,
    fontFamily: Fonts.sans.bold,
    fontSize: 16,
    textAlign: 'left'
  },
  description: {
    color: colors.text,
    fontFamily: Fonts.sans.regular,
    fontSize: 14,
  },
  tempRange: {
    color: colors.textStrong,
    fontFamily: Fonts.sans.bold,
    fontSize: 16,
  },
  alertChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    borderBottomLeftRadius: Radius.large,
    borderBottomRightRadius: Radius.large,
    minHeight: touchTarget.nav,
  },
  alertChipText: {
    flex: 1,
    fontFamily: Fonts.sans.bold,
    fontSize: 14,
  },
});

export default React.memo(DayRow);
