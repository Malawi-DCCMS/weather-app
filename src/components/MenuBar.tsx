import * as React from 'react';
import { Appbar, Icon } from 'react-native-paper';

import { WEATHER_WARNINGS } from '../common';

type MenuBarProps = { location: string };

const MenuBar = (props: MenuBarProps) => {
  const tooLong = props.location.length > 15;
  const fmtLocation = tooLong ? `${props.location?.slice(0, 15)}...` : props.location;
  return (
    <Appbar.Header style={{ backgroundColor: '#E4E5D6', marginTop: -20, paddingBottom: 4 }}>
      <Appbar.Content title={fmtLocation} titleStyle={{fontSize: 20, fontFamily: 'Noto Sans'}} style={{ flexDirection: 'row', paddingLeft: 10, paddingTop: 12 }} />
      <Appbar.Action icon={() => <Icon size={24} source={WEATHER_WARNINGS.yellow} />} onPress={() => { }} style={{marginLeft: -15, paddingTop: 12}} />
      <Appbar.Action icon="magnify" size={24} onPress={() => { }} style={{marginRight: -10, paddingTop: 12}} />
      <Appbar.Action icon="menu" size={24} onPress={() => { }} style={{marginRight: 5, paddingTop: 12}} />
    </Appbar.Header>
  );
}

export default MenuBar;
