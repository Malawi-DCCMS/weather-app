import React, { useState, useEffect, JSX } from 'react';
import { Animated } from 'react-native';
import type { PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';

type FadeInProps = PropsWithChildren<{ style: ViewStyle }>;

export const FadeIn: React.FC<FadeInProps> = (props): JSX.Element => {
  // useState's lazy initializer runs exactly once, unlike
  // useRef(new Animated.Value(0)) — that constructor argument gets
  // evaluated (and its result immediately discarded) on every re-render,
  // even though useRef only ever keeps the first one.
  const [fadeAnimation] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [fadeAnimation]);

  return (
    <Animated.View
      style={{
        ...props.style,
        opacity: fadeAnimation,
      }}>
      {props.children}
    </Animated.View>
  );
};