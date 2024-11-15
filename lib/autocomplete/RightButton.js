import React, { memo, useEffect, useRef } from 'react'
import { ActivityIndicator, Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native'
import { ChevronDown, XCircle } from 'react-native-feather'

export const RightButton = memo(
  ({
    inputHeight,
    onClearPress,
    onChevronPress,
    isOpened,
    showChevron,
    showClear,
    loading,
    buttonsContainerStyle,
    ChevronIconComponent,
    ClearIconComponent,
    RightIconComponent,
    onRightIconComponentPress
  }) => {
    const isOpenedAnimationValue = useRef(new Animated.Value(0)).current

    useEffect(() => {
      Animated.timing(isOpenedAnimationValue, {
        duration: 350,
        toValue: isOpened ? 1 : 0,
        useNativeDriver: true,
        easing: Easing.bezier(0.3, 0.58, 0.25, 0.99)
      }).start()
    }, [isOpened])

    const chevronSpin = isOpenedAnimationValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '180deg']
    })

    return (
      <View
        style={{
          ...styles.container,
          height: inputHeight,
          ...buttonsContainerStyle
        }}>
        {!loading && showClear && (
          <TouchableOpacity onPress={onClearPress} style={styles.clearButton}>
            {ClearIconComponent ?? <XCircle width={18} stroke="#aeb4c6" />}
          </TouchableOpacity>
        )}
        {loading && <ActivityIndicator color="#999" />}
        {RightIconComponent && (
          <TouchableOpacity onPress={onRightIconComponentPress} style={styles.chevronButton}>
            {RightIconComponent}
          </TouchableOpacity>
        )}
        {showChevron && (
          <Animated.View style={{ transform: [{ rotate: chevronSpin }] }}>
            <TouchableOpacity onPress={onChevronPress} style={styles.chevronButton}>
              {ChevronIconComponent ?? <ChevronDown width={20} stroke="#727992" />}
            </TouchableOpacity>
          </Animated.View>
        )}
      </View>
    )
  }
)

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flex: 0,
    flexDirection: 'row',
    right: 8,
    zIndex: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  clearButton: {
    width: 26,
    alignItems: 'center'
  },
  chevronButton: {
    width: 26,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center'
  }
})
