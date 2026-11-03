import i18n, { LanguageDetectorModule } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { storage } from '@/lib/storage';
import { LANGUAGES } from './translations';

const STORE_LANGUAGE_KEY = 'settings.lang';

// MMKV reads are synchronous, so detection no longer needs the
// callback-based async detector interface.
const languageDetectorPlugin: LanguageDetectorModule = {
    type: 'languageDetector',
    detect: () => storage.getString(STORE_LANGUAGE_KEY) ?? 'en',
    cacheUserLanguage: (language: string) => {
        storage.set(STORE_LANGUAGE_KEY, language);
    },
};

// Build resources object from LANGUAGES configuration
const resources: { [key: string]: { translation: any } } = {};
Object.entries(LANGUAGES).forEach(([key, { resources: res }]) => {
  resources[key] = { translation: res };
});

i18n.use(initReactI18next).use(languageDetectorPlugin).init({
    resources,
    compatibilityJSON: 'v4',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});
export default i18n;