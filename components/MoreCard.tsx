import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { ThemeColors, Fonts, Radius, shadow, Spacing, touchTarget } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

type MoreCardProps = {
  // MaterialCommunityIcons name, same set as the tab bar.
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  testID?: string;
};

// One entry on the More conditions screen: icon tile, title + description,
// chevron. The whole card is the tap target and reads as a single
// "[title], [description], button" item to screen readers.
function MoreCard({ icon, title, description, onPress, testID }: MoreCardProps) {
  const colors = useTheme();
  const styles = useMemo(() => makeStyles(colors), [colors]);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`${title}, ${description}`}
      testID={testID}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.tile}>
        <Icon source={icon} size={28} color={colors.primary} />
      </View>
      <View style={styles.textBlock}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <Icon source="chevron-right" size={26} color={colors.primary} />
    </Pressable>
  );
}

export default MoreCard;

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    minHeight: touchTarget.nav,
    padding: Spacing.lg,
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: Radius.large,
    // Same border/radius/shadow as DayRow and the other forecast cards.
    ...shadow.sm,
  },
  cardPressed: {
    backgroundColor: colors.bgHover,
  },
  tile: {
    width: 52,
    height: 52,
    borderRadius: Radius.medium,
    backgroundColor: colors.bgTint,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBlock: {
    flex: 1,
    flexShrink: 1,
  },
  title: {
    fontSize: 17,
    fontFamily: Fonts.sans.bold,
    color: colors.textStrong,
  },
  description: {
    fontSize: 14,
    fontFamily: Fonts.sans.regular,
    color: colors.text,
    marginTop: 2,
  },
});
