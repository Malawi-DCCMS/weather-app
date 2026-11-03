import { useThemeStore } from '@/lib/store/theme-store';

export function useThemeToggle() {
  const isDarkMode = useThemeStore((state) => state.isDarkMode);
  const setIsDarkMode = useThemeStore((state) => state.setIsDarkMode);
  return { isDarkMode, setIsDarkMode };
}
