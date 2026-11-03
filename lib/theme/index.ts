import { Platform } from 'react-native';

// Design tokens mirrored from docs/STYLE.md — do not invent new colors, always pull from here.
// Light is the reference palette; dark is a token-for-token retint (Zanyengo
// Redesign reference, "Turn 5 — dark mode"). Severity accent colors
// (danger/warning/success) and anything meant to pop as a white pill against
// a colored hero stay identical in both themes — only surfaces/text/tints
// shift. Consume via `useTheme()` (lib/theme/ThemeContext), never
// import a fixed palette directly in component code.
export const Colors = {
  light: {
    primary: '#0C447C',
    primaryHov: '#176C9C',
    primaryPrs: '#093766',
    accent: '#226296',
    info: '#3E8ED0',
    bgTint: '#E6F1FB',
    bgTintLight: '#EAF2F9',
    bgOverlay: '#0A2240',
    bgFooter: '#0C447C',

    bg: '#FFFFFF',
    bgAlt: '#F8F9FB',
    bgHover: '#F4F6F9',
    bgMuted: '#E0E0E0',
    border: '#DCDCDC',

    text: '#363636',
    textStrong: '#1A1A1A',
    textSubtle: '#707070',
    textMuted: '#999999',
    textInverse: '#FFFFFF',
    focus: '#176C9C',

    success: '#0B612D',
    successBg: '#D1FAE5',
    warning: '#92400E',
    warningBg: '#FEF3C7',
    danger: '#B91C1C',
    dangerBg: '#FEE2E2',
    infoText: '#1E40AF',
    infoBg: '#DBEAFE',
  },
  dark: {
    primary: '#6FB3EA',
    primaryHov: '#8AC4EA',
    primaryPrs: '#5A9FD9',
    accent: '#8AC4EA',
    info: '#6FB3EA',
    bgTint: '#152C40',
    bgTintLight: '#152C40',
    bgOverlay: '#0B0F14',
    bgFooter: '#152C40',

    bg: '#17202A',
    bgAlt: '#0B0F14',
    bgHover: '#202A34',
    bgMuted: '#2A3540',
    border: '#2A3540',

    text: '#C7D0DA',
    textStrong: '#F2F4F7',
    textSubtle: '#93A0AC',
    textMuted: '#7C8792',
    textInverse: '#FFFFFF',
    focus: '#8AC4EA',

    success: '#0B612D',
    successBg: '#D1FAE5',
    warning: '#FBBF24',
    warningBg: '#2E230A',
    danger: '#B91C1C',
    dangerBg: '#2A1414',
    infoText: '#1E40AF',
    infoBg: '#DBEAFE',
  },
} as const;

export type ThemeColors = { [K in keyof typeof Colors.light]: string };
export type ThemeColor = keyof typeof Colors.light;

// Big current-temperature numerals: #0A2240 on light, pure white on dark —
// distinct from any text.* token, so it gets its own key.
export const tempTextColor: { light: string; dark: string } = {
  light: '#0A2240',
  dark: '#FFFFFF',
};

export const Spacing = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 64,
} as const;

export const Radius = {
  small: 8,
  medium: 12,
  large: 16,
  extraLarge: 28,
} as const;



export const Fonts = {
  sans: Platform.select({
    ios: {
      regular: 'OpenSans_400Regular',
      medium: 'OpenSans_500Medium',
      bold: 'OpenSans_700Bold',
    },
    android: {
      regular: 'OpenSans_400Regular',
      medium: 'OpenSans_500Medium',
      bold: 'OpenSans_700Bold',
    },
    default: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
  }),
  mono: Platform.select({
    ios: { regular: 'Courier New', bold: 'Courier-Bold' },
    android: { regular: 'monospace', bold: 'monospace' },
    web: { regular: 'monospace', bold: 'monospace' },
    default: { regular: 'monospace', bold: 'monospace' },
  }),
} as const;

// bodySm/caption/label are floored at 14px, below docs/STYLE.md's web scale
// (13/12/11px) — this app's low-literacy, possibly low-vision audience needs
// no readable text smaller than 14px on phones (accessibility pass, Step 7).
export const type = {
  display: { fontSize: 40, fontFamily: Fonts.sans.bold },
  h1: { fontSize: 32, fontFamily: Fonts.sans.bold },
  h2: { fontSize: 26, fontFamily: Fonts.sans.bold },
  h3: { fontSize: 20, fontFamily: Fonts.sans.bold },
  h4: { fontSize: 17, fontFamily: Fonts.sans.bold },
  h5: { fontSize: 15, fontFamily: Fonts.sans.bold },
  bodyLg: { fontSize: 16, fontFamily: Fonts.sans.regular },
  body: { fontSize: 14, fontFamily: Fonts.sans.regular },
  bodySm: { fontSize: 14, fontFamily: Fonts.sans.regular },
  caption: { fontSize: 14, fontFamily: Fonts.sans.regular },
  label: { fontSize: 14, fontFamily: Fonts.sans.bold },
} as const;

const elevation = (elev: number) => ({
  elevation: elev,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: Number((0.04 + elev * 0.01).toFixed(2)),
  shadowRadius: elev * 2,
  boxShadow: `0px 1px ${elev * 2}px 0px rgba(0, 0, 0, ${Number((0.03 + elev * 0.01).toFixed(2))})`,
});

export const shadow = {
  sm: elevation(2),
  md: elevation(4),
  lg: elevation(8),
  xl: elevation(12),
} as const;

// `min` matches docs/STYLE.md's general 44px baseline; `nav` is the stricter
// 48dp the handoff calls for specifically on nav items, toggles, and list rows.
export const touchTarget = { min: 44, nav: 48 };

// Today's current-temperature display size per breakpoint, per the
// responsive viewport guide (Step 8). Large (400-599dp) is the reference
// density this whole redesign was built against in Steps 1-7.
export const tempSize = { small: 44, medium: 52, large: 60, xl: 60 } as const;

// Left nav rail width at the XL breakpoint (>=600dp), replacing the bottom
// tab bar used on phones.
export const navRailWidth = 96;


export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
