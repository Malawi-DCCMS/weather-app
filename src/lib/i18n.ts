import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import englishTranslations from '../../assets/i18n/english.json';
import chichewaTranslations from '../../assets/i18n/chichewa.json';
import { LANGUAGES } from '../common';

i18n.use(initReactI18next).init({
  compatibilityJSON: 'v3',
  lng: LANGUAGES.English,
  fallbackLng: LANGUAGES.English,
  resources: {
    english: englishTranslations,
    chichewa: chichewaTranslations,
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;