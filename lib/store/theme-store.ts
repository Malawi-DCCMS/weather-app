import { Appearance } from 'react-native';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jsonStorage } from '@/lib/storage';

const THEME_KEY = 'theme-storage';

interface ThemeState {
  isDarkMode: boolean;
  setIsDarkMode: (isDarkMode: boolean) => void;
}

const getInitialIsDarkMode = (): boolean => {
  try {
    const raw = jsonStorage.getItem(THEME_KEY);
    if (typeof raw === 'string') {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.state && typeof parsed.state.isDarkMode === 'boolean') {
        return parsed.state.isDarkMode;
      }
    }
  } catch {
    // ignore
  }
  return Appearance.getColorScheme() === 'dark';
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: getInitialIsDarkMode(),
      setIsDarkMode: (isDarkMode) => set({ isDarkMode }),
    }),
    {
      name: THEME_KEY,
      storage: createJSONStorage(() => jsonStorage),
    }
  )
);
