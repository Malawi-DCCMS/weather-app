import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Icon, Text } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { CAPAlert, alertLevel } from '@/lib/alerts/providers/cap-alerts/alert';
import { ALERT_LEAD_WORD_KEYS, WARNING_BAND_TEXT_COLORS, WARNING_COLORS, WEATHER_WARNING_ICONS } from "@/lib/alerts/providers/cap-alerts/icons";
import { Fonts, Radius, Spacing } from '@/lib/theme';

type WeatherAlertProps = {
  alert: CAPAlert;
  onPress: () => void;
  // Number of other active alerts beyond this one — when > 0, the banner
  // becomes a consolidated "+N more warnings" summary instead of pointing
  // at this specific alert's detail.
  extraCount?: number;
}

const WeatherAlert = ({ alert, onPress, extraCount = 0 }: WeatherAlertProps) => {
  const { t } = useTranslation();
  const info = alert.info?.[0];

  if (!info) return null;

  const level = alertLevel(info);
  const leadWord = t(ALERT_LEAD_WORD_KEYS[level]);
  const backgroundColor = WARNING_COLORS[level];
  const textColor = WARNING_BAND_TEXT_COLORS[level];
  const icon = WEATHER_WARNING_ICONS[level.toLowerCase()];
  const subtext = extraCount > 0
    ? t(extraCount === 1 ? 'alert.moreWarningsSingular' : 'alert.moreWarningsPlural', { count: extraCount })
    : t('alert.tapToSeeWhatToDo');

  return (
    <TouchableOpacity
      style={[styles.wrapper, { backgroundColor }]}
      onPress={onPress}
      accessibilityLabel={`${leadWord}: ${info.event}. ${subtext}`}
    >
      {/* Plain Image, not Paper's Icon: Icon tints image sources to one
          colour, which flattens the multi-colour warning PNG and hides
          its exclamation mark. Sits on a white disc so the triangle doesn't
          blend into a band of its own colour (yellow on yellow, red on red). */}
      {icon && (
        <View style={styles.iconDisc}>
          <Image source={icon} style={styles.icon} resizeMode="contain" />
        </View>
      )}
      <View style={styles.textBlock}>
        <Text style={[styles.headline, { color: textColor }]} numberOfLines={2}>{leadWord}: {info.event}</Text>
        <Text style={[styles.subtext, { color: textColor }]}>{subtext}</Text>
      </View>
      <Icon source="chevron-right" size={24} color={textColor} />
    </TouchableOpacity>
  )
};

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderRadius: Radius.medium,
    padding: Spacing.lg,
    gap: Spacing.md,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.06)',
  },
  iconDisc: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    width: 26,
    height: 26,
  },
  textBlock: {
    flex: 1,
  },
  headline: {
    fontSize: 16,
    fontFamily: Fonts.sans.bold,
  },
  subtext: {
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    marginTop: Spacing.sm,
  },
});

export default WeatherAlert;
