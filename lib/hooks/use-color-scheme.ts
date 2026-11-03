import { useThemeStore } from '@/lib/store/theme-store';

export function useColorScheme(): 'light' | 'dark' {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  return isDarkMode ? 'dark' : 'light';
}
