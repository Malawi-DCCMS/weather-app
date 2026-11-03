import { View, type ViewProps } from 'react-native';

import { ThemeColor } from '@/lib/theme';
import { useTheme } from '@/lib/hooks/use-theme';
import { useColorScheme } from '@/lib/hooks/use-color-scheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  type?: ThemeColor;
};

export function ThemedView({ style, lightColor, darkColor, type, ...otherProps }: ThemedViewProps) {
  const activeScheme = useColorScheme();
  const theme = useTheme();

  const backgroundColor = activeScheme === 'dark' && darkColor
    ? darkColor
    : (activeScheme === 'light' && lightColor
      ? lightColor
      : theme[type ?? 'bgAlt']);

  return <View style={[{ backgroundColor, borderColor: theme.border }, style]} {...otherProps} />;
}
