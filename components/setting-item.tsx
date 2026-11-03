import { type ReactNode } from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from './themed-text';
import { Spacing, Radius } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';

export type SettingItemProps = {
  label: string;
  leftIcon: keyof typeof Ionicons.glyphMap;
  leftIconColor: string;
  leftIconBgColor: string;
  rightText?: string;
  rightElement?: ReactNode;
  onPress?: () => void;
  showChevron?: boolean;
};

export default function SettingItem({
  label,
  leftIcon,
  leftIconColor,
  leftIconBgColor,
  rightText,
  rightElement,
  onPress,
  showChevron = true,
}: SettingItemProps) {
  const theme = useTheme();

  const renderContent = () => (
    <>
      <View style={styles.rowLeft}>
        <View style={[styles.iconContainer, { backgroundColor: leftIconBgColor }]}>
          <Ionicons name={leftIcon} size={20} color={leftIconColor} />
        </View>
        <ThemedText type="smallBold">{label}</ThemedText>
      </View>
      <View style={styles.rowRight}>
        {rightText ? (
          <ThemedText themeColor="textSubtle" type="small">
            {rightText}
          </ThemedText>
        ) : null}
        {rightElement}
        {showChevron && onPress ? (
          <Ionicons name="chevron-forward" size={16} color={theme.textSubtle} />
        ) : null}
      </View>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
        onPress={onPress}
      >
        {renderContent()}
      </Pressable>
    );
  }

  return <View style={styles.row}>{renderContent()}</View>;
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
    minHeight: 48,
  },
  rowPressed: {
    opacity: 0.6,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: Radius.medium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
