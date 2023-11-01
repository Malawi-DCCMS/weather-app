import { ImageSourcePropType } from 'react-native';
import weatherIcons from '../constants/weathericons';

export const DEFAULT_PLACE: Place = {
  name: 'Blantyre',
  position: {lat: -15.786111, long: 35.005833},
};

export const WEATHER_WARNINGS: { [k: string]: ImageSourcePropType } = {
  yellow: weatherIcons['icon_warning_wind_yellow'],
};
