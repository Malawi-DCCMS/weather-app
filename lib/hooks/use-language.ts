import { useTranslation } from 'react-i18next';

import { SUPPORTED_LANGUAGES, getLanguage } from '@/lib/store/language-store';

// Wraps i18next directly instead of a separate store — see the comment in
// language-store.ts for why. i18n.language is reactive here because
// useTranslation() itself subscribes to i18next's languageChanged event
// (the same mechanism that re-renders every t() call across the app), so
// this re-renders correctly regardless of which screen actually called
// i18n.changeLanguage() (Settings, via setLanguageCode below, or Welcome's
// onboarding picker, which calls i18n.changeLanguage() directly).
export function useLanguage() {
  const { i18n } = useTranslation();
  const languageCode = i18n.language;

  return {
    languageCode,
    setLanguageCode: (code: string) => i18n.changeLanguage(code),
    currentLanguage: getLanguage(languageCode),
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
