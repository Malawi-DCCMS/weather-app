import { ImageSourcePropType } from 'react-native';

const warningRed = require('@/assets/warning-red.png');
const warningOrange = require('@/assets/warning-orange.png');
const warningYellow = require('@/assets/warning-yellow.png');

// import warningRed from "@/assets/warning-red.png";
// import warningOrange from '../../assets/warning-orange.png';
// import warningYellow from '../../assets/warning-yellow.png';

export const WEATHER_WARNING_ICONS: { [k: string]: ImageSourcePropType } = {
  red: warningRed,
  orange: warningOrange,
  yellow: warningYellow,
};

export const WARNING_COLORS: { [k in 'Red' | 'Yellow' | 'Orange' | 'Cyan' | 'Blue']: string} = {
  Red: 'rgba(198, 0, 0, 0.60)',
  Yellow: 'rgba(255, 230, 0, 0.6)',
  Orange: 'rgba(255, 157, 0, 0.6)',
  Cyan: 'rgba(57, 156, 199, 0.6)',
  Blue: 'rgba(130, 168, 223, 0.6',
};
