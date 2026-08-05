import { useCallback, type ReactNode } from 'react'
import type { ViewStyle, StyleProp } from 'react-native'
import { useFocusEffect } from 'expo-router'
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated'

interface Props {
  children: ReactNode
  style?:   StyleProp<ViewStyle>
  duration?: number
}

const DEFAULT_STYLE: ViewStyle = { flex: 1 }

export const FadeInOnFocus = ({ children, style, duration = 240 }: Props) => {
  const opacity = useSharedValue(0)

  useFocusEffect(
    useCallback(() => {
      opacity.value = 0
      opacity.value = withTiming(1, { duration, easing: Easing.out(Easing.quad) })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [duration]),
  )

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return <Animated.View style={[DEFAULT_STYLE, style, animatedStyle]}>{children}</Animated.View>
}
