import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jsonStorage } from '@/lib/storage';

const ALWAYS_SHOW_START_PAGE_KEY = 'settings.alwaysShowStartPage';

interface OnboardingToggleState {
  alwaysShowOnboarding: boolean;
  setAlwaysShowOnboarding: (alwaysShowOnboarding: boolean) => void;
}

const getInitialAlwaysShowOnboarding = (): boolean => {
  try {
    const raw = jsonStorage.getItem(ALWAYS_SHOW_START_PAGE_KEY);
    if (typeof raw === 'string') {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.state && typeof parsed.state.alwaysShowOnboarding === 'boolean') {
        return parsed.state.alwaysShowOnboarding;
      }
    }
  } catch {
    // ignore
  }
  return false;
};

export const useOnboardingStore = create<OnboardingToggleState>()(
  persist(
    (set) => ({
      alwaysShowOnboarding: getInitialAlwaysShowOnboarding(),
      setAlwaysShowOnboarding: (alwaysShowOnboarding) => set({ alwaysShowOnboarding }),
    }),
    {
      name: ALWAYS_SHOW_START_PAGE_KEY,
      storage: createJSONStorage(() => jsonStorage),
    }
  )
);
