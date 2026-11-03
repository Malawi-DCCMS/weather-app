import React, { JSX, useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import weatherIcons from '@/lib/forecast/weathericons.constant';
import { ForecastDayRecord } from '@/lib/forecast/types';
import { CONDITION_LABEL_KEYS, conditionBucket, getDayParts, buildTodaySummary } from '@/lib/forecast/day-parts';
import { windLevel, WIND_LEVEL_SENTENCE_KEYS } from '@/lib/forecast/plain-language';
import { ThemeColors, Fonts, Radius, Spacing, tempTextColor } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';
import { useUnits } from '@/lib/hooks/use-units';
import { useColorScheme } from '@/lib/hooks/use-color-scheme';

type CurrentConditionsCardProps = {
  daySummary: ForecastDayRecord;
  location: string;
  tempFontSize: number;
  showWindSummary?: boolean;
  compact?: boolean;
};

function CurrentConditionsCard({ daySummary, location, tempFontSize, showWindSummary, compact }: CurrentConditionsCardProps): JSX.Element {
  const { t } = useTranslation();
  const units = useUnits();
  const scheme = useColorScheme();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors, tempTextColor[scheme]), [colors, scheme]);

  const nowStep = daySummary.steps[0];
  const nowTemp = units.temp(nowStep?.temperature || 0);
  const nowIconSource = nowStep?.weatherSymbol ? weatherIcons[nowStep.weatherSymbol] : undefined;
  const nowConditionLabel = t('condition.now', { condition: t(CONDITION_LABEL_KEYS[conditionBucket(nowStep?.weatherSymbol)]) });

  const dayParts = getDayParts(daySummary);
  const summary = buildTodaySummary(t, location, nowStep, dayParts, units.temp);
  const windSentence = t(WIND_LEVEL_SENTENCE_KEYS[windLevel(daySummary.windSpeed)]);

  return (
    <View style={[styles.currentCard, compact && styles.currentCardCompact]}>
      <View style={styles.currentRow}>
        <View style={styles.currentTempBlock}>
          <Text style={[styles.large, { fontSize: tempFontSize }]}>{nowTemp}</Text>
          <Text style={styles.nowCondition}>{nowConditionLabel}</Text>
        </View>
        <View style={styles.iconBlock}>
          {nowIconSource && <Icon source={nowIconSource} size={80} />}
        </View>
      </View>
      <Text style={styles.summaryText}>
        {summary.lead}{summary.predictive ? <Text style={styles.summaryBold}> {summary.predictive}</Text> : null}{summary.trailing ? ` ${summary.trailing}` : ''}
      </Text>

      {showWindSummary &&
        <View style={styles.windCard}>
          <Icon source="weather-windy" size={20} color={colors.text} />
          <Text style={styles.windText}>
            <Text style={styles.windLabel}>{t("weather.wind")}: </Text>{windSentence}
          </Text>
        </View>
      }
    </View>
  );
}

const makeStyles = (colors: ThemeColors, tempColor: string) => StyleSheet.create({
  currentCard: {
    borderRadius: Radius.large,
    backgroundColor: colors.bgTint,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
  },
  currentCardCompact: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  currentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  currentTempBlock: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconBlock: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: Spacing.md,
  },
  large: {
    fontFamily: Fonts.sans.bold,
    color: tempColor,
  },
  nowCondition: {
    fontSize: 18,
    fontFamily: Fonts.sans.bold,
    color: colors.primary,
  },
  summaryText: {
    fontSize: 16,
    fontFamily: Fonts.sans.regular,
    color: colors.text,
    marginTop: Spacing.xl,
    lineHeight: 22,
  },
  summaryBold: {
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
  },
  windCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginTop: Spacing.lg,
    paddingTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  windText: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts.sans.regular,
    color: colors.text,
  },
  windLabel: {
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
  },
});

export default CurrentConditionsCard;
