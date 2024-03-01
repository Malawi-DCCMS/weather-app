import React, { forwardRef } from 'react';
import { View, type ViewProps, type ViewStyle } from 'react-native';
import { BlurView } from '@react-native-community/blur';

export type GlassViewProps = ViewProps & {
  containerStyle?: ViewStyle;
  glassStyle?: ViewStyle;
  blurStyle?: BlurViewProps;
};

export type BlurViewProps = {
  blurAmount: number;
  blurType: 'dark' | 'light' | 'xlight';
};

export const GlassView = forwardRef<View, GlassViewProps>(
  ({ children, glassStyle, containerStyle, blurStyle, ...rest }, ref) => {
    return (
      <View style={containerStyle} ref={ref}>
        <BlurView
          {...rest}
          blurType={blurStyle?.blurType || "light"}
          blurAmount={blurStyle?.blurAmount || 50}
          reducedTransparencyFallbackColor="white"
          style={[glassStyle]}
        >
          {children}
        </BlurView>
      </View>
    );
  },
);
