import * as React from 'react';
import { Appbar, Icon } from 'react-native-paper';

import { WEATHER_WARNINGS } from '../src/common';

type MenuBarProps = {location: string};

const MenuBar = (props: MenuBarProps) => {
  const tooLong = props.location.length > 15;
  const fmtLocation = tooLong ? `${props.location?.slice(0, 15)}...` : props.location;
  return (
    <Appbar.Header style={{backgroundColor: '#E4E5D6', paddingTop: 2}}>
    <Appbar.Content title={fmtLocation} style={{flexDirection: 'row', paddingLeft: 13}}/>
    <Appbar.Action icon={() => <Icon size={24} source={WEATHER_WARNINGS.yellow} />} onPress={() => {}}/>
    <Appbar.Action icon="magnify" size={24} onPress={() => {}} />
    <Appbar.Action icon="menu" size={24} onPress={() => {}} />
  </Appbar.Header>
  );
}

export default MenuBar;
