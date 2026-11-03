import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationBar } from 'expo-navigation-bar';

type Props = {
  // Colour of the bar content (icons, text), not the bar background.
  style: 'light' | 'dark';
};

// Sets the status bar and Android navigation bar content style together.
// Like react-native-edge-to-edge's SystemBars, each one stacks: the most
// recently mounted instance wins until it unmounts.
export function SystemBars({ style }: Props) {
  return (
    <>
      <StatusBar style={style} />
      <NavigationBar style={style} />
    </>
  );
}
