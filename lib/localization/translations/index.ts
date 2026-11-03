import enResources from './english.json';
import swResources from './swahili.json';
import amResources from './amharic.json';
import omResources from './afaan_oromoo.json';
import tiResources from './tigrinya.json';
import soResources from './somali.json';

export const LANGUAGES = {
  en: {
    label: 'English',
    name: 'English',
    nativeName: 'English',
    resources: enResources,
  },
  // Machine-translated draft (see Step 6 of the Zanyengo redesign) — every
  // key from english.json is covered, but the wording has not been checked
  // by a native Swahili speaker yet. Treat as a starting point, not final copy.
  sw: {
    label: 'Kiswahili',
    name: 'Swahili',
    nativeName: 'Kiswahili',
    resources: swResources,
  },
  am: {
    label: 'Amharic',
    name: 'Amharic',
    nativeName: 'አማርኛ',
    resources: amResources,
  },
  om: {
    label: 'Oromo',
    name: 'Oromo',
    nativeName: 'Afaan Oromoo',
    resources: omResources,
  },
  ti: {
    label: 'Tigrinya',
    name: 'Tigrinya',
    nativeName: 'ትግርኛ',
    resources: tiResources,
  },
  so: {
    label: 'Somali',
    name: 'Somali',
    nativeName: 'Soomaaliga',
    resources: soResources,
  },
};

export type LanguageKey = keyof typeof LANGUAGES;
