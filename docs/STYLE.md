# Style Guide

Reference site: [Climweb](https://climtech.africa/climweb/) · Screenshots: [assets/style-guide/](assets/style-guide/)

---

## Colors

### Brand blues

| &nbsp; | Hex | Where it's used |
|---|---|---|
| ![#0C447C](https://placehold.co/16x16/0C447C/0C447C.png) | `#0C447C` | Primary — buttons, active nav links, footer background, icons, links |
| ![#176C9C](https://placehold.co/16x16/176C9C/176C9C.png) | `#176C9C` | Hover state for anything using the primary color |
| ![#093766](https://placehold.co/16x16/093766/093766.png) | `#093766` | Pressed / active state for buttons and interactive elements |
| ![#226296](https://placehold.co/16x16/226296/226296.png) | `#226296` | Secondary buttons and accent elements |
| ![#3E8ED0](https://placehold.co/16x16/3E8ED0/3E8ED0.png) | `#3E8ED0` | Informational highlights and inline links |
| ![#E6F1FB](https://placehold.co/16x16/E6F1FB/E6F1FB.png) | `#E6F1FB` | Tinted section backgrounds and icon fill backgrounds |
| ![#EAF2F9](https://placehold.co/16x16/EAF2F9/EAF2F9.png) | `#EAF2F9` | Very light wash — subtle alternating rows or hover fills |
| ![#0A2240](https://placehold.co/16x16/0A2240/0A2240.png) | `#0A2240` | Dark hero overlays and dark panel backgrounds |

### Grays

| &nbsp; | Hex | Where it's used |
|---|---|---|
| ![#FFFFFF](https://placehold.co/16x16/FFFFFF/FFFFFF.png) | `#FFFFFF` | Default page and card background; text on dark backgrounds; footer text |
| ![#F8F9FB](https://placehold.co/16x16/F8F9FB/F8F9FB.png) | `#F8F9FB` | Alternate section backgrounds (slightly off-white) |
| ![#F4F6F9](https://placehold.co/16x16/F4F6F9/F4F6F9.png) | `#F4F6F9` | Dropdown and hover backgrounds |
| ![#E0E0E0](https://placehold.co/16x16/E0E0E0/E0E0E0.png) | `#E0E0E0` | Light gray card and section backgrounds |
| ![#DCDCDC](https://placehold.co/16x16/DCDCDC/DCDCDC.png) | `#DCDCDC` | Borders and dividers |
| ![#707070](https://placehold.co/16x16/707070/707070.png) | `#707070` | Secondary / helper text |
| ![#999999](https://placehold.co/16x16/999999/999999.png) | `#999999` | Muted text — timestamps, captions, placeholders |
| ![#363636](https://placehold.co/16x16/363636/363636.png) | `#363636` | Default body text |
| ![#1A1A1A](https://placehold.co/16x16/1A1A1A/1A1A1A.png) | `#1A1A1A` | Headings and display text |
| ![#262C38](https://placehold.co/16x16/262C38/262C38.png) | `#262C38` | Top alert bar and sticky navigation background |

### Status colors

| &nbsp; | &nbsp; | Hex (background / text+icon) | Where it's used |
|---|---|---|---|
| ![#D1FAE5](https://placehold.co/16x16/D1FAE5/D1FAE5.png) | ![#0B612D](https://placehold.co/16x16/0B612D/0B612D.png) | `#D1FAE5` / `#0B612D` | Success |
| ![#FEF3C7](https://placehold.co/16x16/FEF3C7/FEF3C7.png) | ![#92400E](https://placehold.co/16x16/92400E/92400E.png) | `#FEF3C7` / `#92400E` | Warning |
| ![#FEE2E2](https://placehold.co/16x16/FEE2E2/FEE2E2.png) | ![#B91C1C](https://placehold.co/16x16/B91C1C/B91C1C.png) | `#FEE2E2` / `#B91C1C` | Danger / error |
| ![#DBEAFE](https://placehold.co/16x16/DBEAFE/DBEAFE.png) | ![#1E40AF](https://placehold.co/16x16/1E40AF/1E40AF.png) | `#DBEAFE` / `#1E40AF` | Informational |

### CSS Variables

```css
:root {
  --primary-color:     #0C447C;
  --text-color:        #363636;
  --background-color:  #E6F1FB;
  --border-radius:     12px;
}
```

---

## Typography

**Font:** Open Sans (Google Fonts) — weights 300 / 400 / 500 / 600 / 700 / 800

```html
<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">
```

```css
font-family: 'Open Sans', Helvetica, Arial, sans-serif;
```

### Scale

| Token | Web | RN (sp) | Weight | Usage |
|---|---|---|---|---|
| `display` | 56px | 40 | 800 | Hero headlines |
| `h1` | 40px | 32 | 700 | Page titles |
| `h2` | 32px | 26 | 700 | Section headings |
| `h3` | 24px | 20 | 600 | Sub-section headings |
| `h4` | 20px | 17 | 600 | Card titles |
| `h5` | 16px | 15 | 600 | Small headings |
| `body-lg` | 18px | 16 | 400 | Lead paragraphs |
| `body` | 16px | 14 | 400 | Default copy |
| `body-sm` | 14px | 13 | 400 | Secondary text |
| `caption` | 12px | 12 | 400 | Timestamps, metadata |
| `label` | 12px | 11 | 600 | Form labels, badges |

---

## Spacing

4px base unit.

| Token | px |
|---|---|
| `space-1` | 4 |
| `space-2` | 8 |
| `space-3` | 12 |
| `space-4` | 16 |
| `space-6` | 24 |
| `space-8` | 32 |
| `space-10` | 40 |
| `space-12` | 48 |
| `space-16` | 64 |

---

## Border Radius

| Token | Value | Usage |
|---|---|---|
| `radius-sm` | 4px | Tags, badges |
| `radius-md` | 8px | Inputs |
| `radius-lg` | 12px | **Default** — cards, dropdowns |
| `radius-xl` | 16px | Modals |
| `radius-full` | 9999px | Pill badges, avatars |

---

## Shadows

| Token | `box-shadow` | Android `elevation` |
|---|---|---|
| `shadow-sm` | `0 1px 2px rgba(0,0,0,.06), 0 1px 3px rgba(0,0,0,.10)` | 2 |
| `shadow-md` | `0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.06)` | 4 |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,.08), 0 4px 6px rgba(0,0,0,.05)` | 8 |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,.10), 0 10px 10px rgba(0,0,0,.04)` | 12 |

---

## Components

### Buttons

| Variant | Background | Text | Border |
|---|---|---|---|
| Primary | `#0C447C` | `#FFF` | none |
| Secondary | `#226296` | `#FFF` | none |
| Ghost | transparent | `#0C447C` | 1.5px `#0C447C` |
| Danger | `#B91C1C` | `#FFF` | none |

Height: 32px (sm) / 40px (md) / 48px (lg). Font: Open Sans 600. Radius: 12px.

### Inputs

Height: 40px. Border: 1.5px `#DCDCDC`. Radius: 8px. Focus border: `#176C9C` + `0 0 0 3px #176c9c33`.

### Cards

Background: white. Border: 1px `#E0E0E0`. Radius: 12px. Shadow: `shadow-sm`. Padding: 24px.

### Badges

Radius: 9999px. Padding: 4px 12px. Font: 12px / weight 600.

| Variant | Background | Text |
|---|---|---|
| Primary | `#E6F1FB` | `#0C447C` |
| Success | `#D1FAE5` | `#0B612D` |
| Warning | `#FEF3C7` | `#92400E` |
| Danger | `#FEE2E2` | `#B91C1C` |

### Alerts

Left border: 4px in status color. Radius: 8px. Padding: 16px 24px.

---

## Layout

- **Grid:** 12 columns, 24px gutter, 1344px max width
- **Breakpoints:** 480 / 768 / 1024 / 1216 / 1408px
- **Nav height:** 64px desktop / 56px mobile
- **Alert bar height:** 36px (background: `#262C38`)

---

## React Native

### Fonts

```ts
import { OpenSans_400Regular, OpenSans_600SemiBold, OpenSans_700Bold, OpenSans_800ExtraBold } from '@expo-google-fonts/open-sans';
```

### Theme constants

```ts
export const colors = {
  primary:    '#0C447C',
  primaryHov: '#176C9C',
  primaryPrs: '#093766',
  accent:     '#226296',
  bgTint:     '#E6F1FB',
  bgOverlay:  '#0A2240',
  bgFooter:   '#0C447C',
  text:       '#363636',
  textStrong: '#1A1A1A',
  textSubtle: '#707070',
  textMuted:  '#999999',
  textInverse:'#FFFFFF',
  border:     '#DCDCDC',
  focus:      '#176C9C',
  success:    '#0B612D', successBg: '#D1FAE5',
  warning:    '#92400E', warningBg: '#FEF3C7',
  danger:     '#B91C1C', dangerBg:  '#FEE2E2',
  info:       '#1E40AF', infoBg:    '#DBEAFE',
} as const;

export const space = { 1:4, 2:8, 3:12, 4:16, 6:24, 8:32, 10:40, 12:48, 16:64 } as const;
export const radius = { sm:4, md:8, lg:12, xl:16, full:9999 } as const;
```

### Shadows

```ts
import { Platform } from 'react-native';
const shadow = (elev: number) => Platform.select({
  ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: elev / 2 }, shadowOpacity: 0.10 + elev * 0.005, shadowRadius: elev * 1.5 },
  android: { elevation: elev },
});
// sm → shadow(2), md → shadow(4), lg → shadow(8), xl → shadow(12)
```

### Touch targets

Minimum **44×44px**. Use `hitSlop={{ top:8, bottom:8, left:8, right:8 }}` when the visual element is smaller.

---

## Visual Reference

| | |
|---|---|
| ![Hero](assets/style-guide/01-hero.png) | ![Navbar](assets/style-guide/02-navbar.png) |
| ![Content](assets/style-guide/04-content.png) | ![Cards](assets/style-guide/05-cards.png) |
| ![Lower](assets/style-guide/06-lower.png) | ![Footer](assets/style-guide/03-footer.png) |
