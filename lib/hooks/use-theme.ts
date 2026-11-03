/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/lib/theme';
import { useColorScheme } from '@/lib/hooks/use-color-scheme';

export function useTheme() {
  const scheme = useColorScheme();
  return Colors[scheme];
}
