import { ImageSourcePropType } from 'react-native';

import { ThemeColors } from '@/lib/theme';

const warningRed = require('@/assets/warning-red.png');
const warningOrange = require('@/assets/warning-orange.png');
const warningYellow = require('@/assets/warning-yellow.png');

export const WEATHER_WARNING_ICONS: { [k: string]: ImageSourcePropType } = {
  red: warningRed,
  orange: warningOrange,
  yellow: warningYellow,
};

// Flat, opaque alert-level colors (no transparency — see docs/STYLE.md "flat colors only").
export const WARNING_COLORS: { [k in 'Red' | 'Yellow' | 'Orange' | 'Cyan' | 'Blue']: string} = {
  Red: '#C60000',
  Yellow: '#FFE600',
  Orange: '#FF9D00',
  Cyan: '#399CC7',
  Blue: '#82A8DF',
};

// Short severity lead word ("Danger"/"Warning"/"Caution"/"Notice") used by
// compact banner/chip contexts (WeatherAlert.tsx, DayRow.tsx's per-day chip).
export const ALERT_LEAD_WORD_KEYS: { [k in 'Red' | 'Yellow' | 'Orange' | 'Cyan' | 'Blue']: string } = {
  Red: 'alert.lead.red',
  Orange: 'alert.lead.orange',
  Yellow: 'alert.lead.yellow',
  Cyan: 'alert.lead.notice',
  Blue: 'alert.lead.notice',
};

// Worst-first ordering used to pick which alert leads a consolidated banner
// when more than one is active for the current location.
export const ALERT_SEVERITY_RANK: { [k in 'Red' | 'Yellow' | 'Orange' | 'Cyan' | 'Blue']: number } = {
  Red: 0,
  Orange: 1,
  Yellow: 2,
  Cyan: 3,
  Blue: 4,
};

// Text/icon color to use on top of WARNING_COLORS — Yellow and Blue are too
// light for white text, so they get dark text instead. WARNING_COLORS bands
// themselves don't retint for dark mode (see docs on that map), so this
// pairing is fixed rather than sourced from theme tokens.
export const WARNING_BAND_TEXT_COLORS: { [k in 'Red' | 'Yellow' | 'Orange' | 'Cyan' | 'Blue']: string } = {
  Red: '#FFFFFF',
  Orange: '#FFFFFF',
  Yellow: '#1A1A1A',
  Cyan: '#FFFFFF',
  Blue: '#1A1A1A',
};

// Light tint + dark text pairs for "What to do" boxes, sourced from the
// active theme's status colors (danger/warning/info) since the 5 CAP levels
// map onto fewer visually-distinct tints than raw severities. Unlike
// WARNING_COLORS/WARNING_BAND_TEXT_COLORS, these DO retint for dark mode —
// call with the current `useTheme()` result.
export function getWarningTintColors(colors: ThemeColors): { [k in 'Red' | 'Yellow' | 'Orange' | 'Cyan' | 'Blue']: { bg: string; text: string } } {
  return {
    Red: { bg: colors.dangerBg, text: colors.danger },
    Orange: { bg: colors.warningBg, text: colors.warning },
    Yellow: { bg: colors.warningBg, text: colors.warning },
    Cyan: { bg: colors.infoBg, text: colors.infoText },
    Blue: { bg: colors.infoBg, text: colors.infoText },
  };
}
