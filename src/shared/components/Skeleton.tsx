import { useEffect, useRef } from 'react'
import { Animated, type DimensionValue } from 'react-native'
import { Colors } from '@/shared/constants/tokens'

interface SkeletonProps {
  width: DimensionValue
  height: number
  borderRadius?: number
  color?: string
}

export const Skeleton = ({ width, height, borderRadius = 8, color = Colors.sand }: SkeletonProps) => {
  const opacity = useRef(new Animated.Value(0.5)).current

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 800, useNativeDriver: true }),
      ]),
    )
    animation.start()
    return () => animation.stop()
  }, [opacity])

  return (
    <Animated.View
      style={{ width, height, borderRadius, backgroundColor: color, opacity }}
    />
  )
}
