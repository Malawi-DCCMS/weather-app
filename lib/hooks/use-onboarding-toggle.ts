import { useOnboardingStore } from "@/lib/store/onboarding-store";

export function useOnboardingToggle() {
  const alwaysShowOnboarding = useOnboardingStore((state) => state.alwaysShowOnboarding);
  const setAlwaysShowOnboarding = useOnboardingStore((state) => state.setAlwaysShowOnboarding);

  return {
    alwaysShowOnboarding,
    setAlwaysShowOnboarding,
  };
}
