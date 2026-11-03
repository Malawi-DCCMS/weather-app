import { LANGUAGES } from '@/lib/localization/translations';

// Just data + a lookup here — no Zustand store. The "current language" is
// i18next's own state (see lib/hooks/use-language.ts), which already
// persists itself via languageDetectorPlugin (lib/localization/i18n.ts);
// keeping a second, separately-persisted copy here previously meant this
// module's languageCode and i18next's actual active language could (and
// did) drift apart — most visibly, Settings' language picker wrote here
// without ever calling i18n.changeLanguage(), so picking a language there
// had no effect on the app.
export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: Language[] = Object.entries(LANGUAGES).map(
  ([code, config]) => ({
    code,
    name: config.name,
    nativeName: config.nativeName,
  })
);

export function getLanguage(code: string): Language {
  return SUPPORTED_LANGUAGES.find((lang) => lang.code === code) || SUPPORTED_LANGUAGES[0];
}
