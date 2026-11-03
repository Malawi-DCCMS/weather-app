import React, { JSX, useMemo } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';
import { useTranslation } from 'react-i18next';

import { ThemeColors, Fonts, Radius, Spacing, touchTarget } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

type StatusCardProps = {
  icon: string;
  iconColor?: string;
  title: string;
  text?: string;
  // Renders an action button when provided — retrying a failed fetch,
  // or sending the user somewhere useful (e.g. "Choose a place"). Omit
  // for plain informational cards (e.g. "no warnings right now").
  onRetry?: () => void;
  // Overrides the button label, which otherwise defaults to "Retry".
  actionLabel?: string;
};

// Shared "nothing to show" / "something went wrong" card. Mirrors the
// visual pattern already used for Warnings' empty state, with an optional
// action button for error/unknown-state cases (Today, Favourites, Alerts,
// NoLocation, 5 Days).
function StatusCard({ icon, iconColor, title, text, onRetry, actionLabel }: StatusCardProps): JSX.Element {
  const { t } = useTranslation();
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);
  const label = actionLabel ?? t("common.actions.retry");

  return (
    <View style={styles.card}>
      <Icon source={icon} size={32} color={iconColor ?? colors.textSubtle} />
      <Text style={styles.title}>{title}</Text>
      {text && <Text style={styles.text}>{text}</Text>}
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry} accessibilityLabel={label}>
          <Text style={styles.retryButtonText}>{label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radius.large,
    padding: Spacing.xl,
    marginTop: Spacing.lg,
    marginBottom: Spacing.lg,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    boxShadow: '0px 1px 4px 0px rgba(0, 0, 0, 0.05)',
  },
  title: {
    fontSize: 16,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
    marginTop: Spacing.md,
    textAlign: 'center',
  },
  text: {
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    color: colors.text,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  retryButton: {
    marginTop: Spacing.lg,
    minHeight: touchTarget.nav,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.medium,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: Fonts.sans.bold,
    color: colors.textInverse,
  },
});

export default StatusCard;
