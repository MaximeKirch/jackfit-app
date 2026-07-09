import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, type DimensionValue } from 'react-native'

interface SkeletonProps {
  width: DimensionValue
  height: number
  borderRadius?: number
}

export const Skeleton = ({ width, height, borderRadius = 8 }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.3)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
      ]),
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return <Animated.View style={[styles.skeleton, { width, height, borderRadius, opacity }]} />
}

const styles = StyleSheet.create({
  skeleton: { backgroundColor: '#E1E9EE' },
})
