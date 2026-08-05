import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { Colors, Radius } from '@/shared/constants/tokens'

interface Props {
  progress: number // 0-1
  delay: number
  isOpen: boolean
}

const DURATION = 800

export const StageProgressBar = ({ progress, delay, isOpen }: Props) => {
  const width = useSharedValue(0)

  useEffect(() => {
    if (isOpen) {
      width.value = withDelay(
        delay,
        withTiming(progress * 100, { duration: DURATION, easing: Easing.out(Easing.cubic) }),
      )
    } else {
      width.value = 0
    }
  }, [isOpen, progress, delay, width])

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }))

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, barStyle]} />
    </View>
  )
}

const styles = StyleSheet.create({
  track: {
    height:          8,
    backgroundColor: Colors.linen,
    borderRadius:    Radius.full,
    overflow:        'hidden',
  },
  fill: {
    height:          '100%',
    borderRadius:    Radius.full,
    backgroundColor: Colors.moss,
  },
})
