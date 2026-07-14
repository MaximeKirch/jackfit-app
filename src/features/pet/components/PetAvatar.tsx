import { useEffect, useRef } from 'react'
import { Animated, View, Text } from 'react-native'
import { Colors } from '@/shared/constants/tokens'
import type { PetStatus } from '@/shared/types/pet.types'

interface PetAvatarProps {
  status:         PetStatus
  size?:          number
  isCelebrating?: boolean
}

const BREATHE_DURATION: Record<PetStatus, number> = {
  PEAK:        1800,
  GOOD:        2400,
  TIRED:       3200,
  LAZY:        4000,
  OVERREACHED: 4800,
}

const BREATHE_SCALE: Record<PetStatus, number> = {
  PEAK:        1.08,
  GOOD:        1.06,
  TIRED:       1.04,
  LAZY:        1.02,
  OVERREACHED: 1.01,
}

export const PetAvatar = ({ status, size = 180, isCelebrating = false }: PetAvatarProps) => {
  const scale   = useRef(new Animated.Value(1)).current
  const opacity = useRef(new Animated.Value(0.15)).current
  const bounceY = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const duration = BREATHE_DURATION[status]
    const toScale  = BREATHE_SCALE[status]

    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(scale,   { toValue: toScale, duration, useNativeDriver: true }),
        Animated.timing(scale,   { toValue: 1,       duration, useNativeDriver: true }),
      ]),
    )
    const halo = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.25, duration, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.08, duration, useNativeDriver: true }),
      ]),
    )

    breathe.start()
    halo.start()

    return () => {
      breathe.stop()
      halo.stop()
    }
  }, [status])

  useEffect(() => {
    if (!isCelebrating) return

    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceY, { toValue: -20, duration: 200, useNativeDriver: true }),
        Animated.timing(bounceY, { toValue: 0,   duration: 200, useNativeDriver: true }),
      ]),
      { iterations: 4 },
    )

    bounce.start()

    return () => {
      bounce.stop()
      bounceY.setValue(0)
    }
  }, [isCelebrating])

  const color = Colors.pet[status]

  return (
    <View style={{ width: size * 1.5, height: size * 1.5, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        style={{
          position:        'absolute',
          width:           size * 1.4,
          height:          size * 1.4,
          borderRadius:    size * 0.7,
          backgroundColor: color,
          opacity,
        }}
      />
      <Animated.View
        style={{
          position:        'absolute',
          width:           size,
          height:          size,
          borderRadius:    size / 2,
          backgroundColor: color,
          transform:       [{ scale }, { translateY: bounceY }],
        }}
      />
      {isCelebrating && (
        <Text style={{ position: 'absolute', top: 0, fontSize: 24 }}>✨</Text>
      )}
    </View>
  )
}
