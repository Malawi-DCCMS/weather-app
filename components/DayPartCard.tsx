import React, { JSX, useMemo } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import weatherIcons from '@/lib/forecast/weathericons.constant';
import { DayPart, DayPartSummary, DAY_PART_LABEL_KEYS, CONDITION_LABEL_KEYS, conditionBucket } from '@/lib/forecast/day-parts';
import { ThemeColors, Fonts, Radius, Spacing } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';
import { useUnits } from '@/lib/hooks/use-units';

type DayPartCardProps = {
  part: DayPart;
  summary: DayPartSummary;
  style?: StyleProp<ViewStyle>;
};

function DayPartCard({ part, summary, style }: DayPartCardProps): JSX.Element {
  const { t } = useTranslation();
  const units = useUnits();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  const iconSource = summary.weatherSymbol ? weatherIcons[summary.weatherSymbol] : undefined;
  const conditionLabel = t(CONDITION_LABEL_KEYS[conditionBucket(summary.weatherSymbol)]);

  return (
    <View style={[styles.card, style]} accessible={true} accessibilityLabel={`${t(DAY_PART_LABEL_KEYS[part])}: ${units.tempSpoken(summary.temperature || 0)}, ${conditionLabel}`}>
      <View style={styles.leftCol}>
        <Text style={styles.partLabel}>{t(DAY_PART_LABEL_KEYS[part])}</Text>
        <Text style={styles.temp}>{units.temp(summary.temperature || 0)}</Text>
        <Text style={styles.condition} numberOfLines={1}>{conditionLabel}</Text>
      </View>
      <View style={styles.rightCol}>
        {iconSource && <Icon source={iconSource} size={48} />}
      </View>
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    width: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radius.large,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
  },
  leftCol: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  rightCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: Spacing.sm,
  },
  partLabel: {
    fontSize: 14,
    fontFamily: Fonts.sans.bold,
    color: colors.textSubtle,
  },
  temp: {
    fontSize: 24,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
  },
  condition: {
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    color: colors.text,
  },
});

export default DayPartCard;
