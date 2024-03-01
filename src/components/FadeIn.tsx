import React, { useRef, useEffect } from 'react';
import { Animated } from 'react-native';
import type { PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';

type FadeInProps = PropsWithChildren<{ style: ViewStyle }>;

export const FadeIn: React.FC<FadeInProps> = (props): JSX.Element => {
  const fadeAnimation = useRef(new Animated.Value(0)).current;

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