import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { en, chi } from './translations';

const STORE_LANGUAGE_KEY = 'settings.lang';

const languageDetectorPlugin = {
    type: 'languageDetector',
    async: true,
    init: () => { },
    detect: async function (callback: (lang: string) => void) {
        try {
            await AsyncStorage.getItem(STORE_LANGUAGE_KEY).then((language) => {
                if (language) {
                    return callback(language);
                } else {
                    return callback('en');
                }
            });
        } catch (error) {
            console.error('There was an error reading the cached language:', error);
        }
    },
    cacheUserLanguage: async function (language: string) {
        try {
            await AsyncStorage.setItem(STORE_LANGUAGE_KEY, language);
        } catch (error) { }
    },
};
const resources = {
    en: {
        translation: en,
    },
    chi: {
        translation: chi,
    },
};

i18n.use(initReactI18next).use(languageDetectorPlugin).init({
    resources,
    compatibilityJSON: 'v3',
    fallbackLng: 'en',
    interpolation: {
        escapeValue: false,
    },
});
export default i18n;