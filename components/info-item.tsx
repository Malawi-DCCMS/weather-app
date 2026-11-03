import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { ThemedText } from './themed-text';
import { Spacing } from '@/lib/theme';

export type InfoItemProps = {
  title: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
};

export default function InfoItem({
  title,
  description,
  icon,
  iconColor = '#34c759',
}: InfoItemProps) {
  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={18} color={iconColor} style={styles.icon} />
      <View style={styles.textContainer}>
        <ThemedText type="smallBold">{title}</ThemedText>
        <ThemedText themeColor="textSubtle" type="small">
          {description}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  icon: {
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
});
