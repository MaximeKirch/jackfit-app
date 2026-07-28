import { useEffect, useState } from 'react'
import { Animated, Image, View } from 'react-native'
import Svg, { Circle, G } from 'react-native-svg'
import { Colors } from '@/shared/constants/tokens'
import { PET_STATES, type PetStatus } from '@/shared/types/pet.types'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface Props {
  status:         PetStatus
  xpProgress:     number   // 0–1
  size?:          number
  isCelebrating?: boolean
}

const RING_THICKNESS = 10
const GAP            = 36  // espace entre l'anneau et le placeholder central

export const PetRing = ({ status, xpProgress, size = 200, isCelebrating = false }: Props) => {
  const radius       = (size - RING_THICKNESS) / 2
  const circumference = 2 * Math.PI * radius
  const center       = size / 2
  const innerSize    = size - RING_THICKNESS * 2 - GAP * 2
  const innerRadius  = innerSize / 2
  const innerOffset  = center - innerRadius

  // useState lazy init: Animated.Value créé une seule fois, stable sans ref
  const [progress] = useState(() => new Animated.Value(0))
  const [bounceY]  = useState(() => new Animated.Value(0))
  const [breathe]  = useState(() => new Animated.Value(1))

  useEffect(() => {
    Animated.timing(progress, {
      toValue:         xpProgress,
      duration:        900,
      delay:           150,
      useNativeDriver: false,
    }).start()
  }, [xpProgress, progress])

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1.04, duration: 2800, useNativeDriver: true }),
        Animated.timing(breathe, { toValue: 1,    duration: 2800, useNativeDriver: true }),
      ])
    )
    loop.start()
    return () => loop.stop()
  }, [breathe])

  useEffect(() => {
    if (!isCelebrating) { bounceY.setValue(0); return }
    const bounce = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceY, { toValue: -16, duration: 200, useNativeDriver: true }),
        Animated.timing(bounceY, { toValue: 0,   duration: 200, useNativeDriver: true }),
      ]),
      { iterations: 4 }
    )
    bounce.start()
    return () => bounce.stop()
  }, [isCelebrating, bounceY])

  const strokeDashoffset = progress.interpolate({
    inputRange:  [0, 1],
    outputRange: [circumference, 0],
  })

  const petColor = Colors.pet[status]

  return (
    <Animated.View style={{ transform: [{ translateY: bounceY }] }}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={Colors.sand}
          strokeWidth={RING_THICKNESS}
          fill="none"
          strokeLinecap="round"
        />
        {/* Fill — rotation -90° pour démarrer la progression en haut */}
        <G rotation="-90" origin={`${center}, ${center}`}>
          <AnimatedCircle
            cx={center}
            cy={center}
            r={radius}
            stroke={Colors.pet.GOOD}
            strokeWidth={RING_THICKNESS}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
          />
        </G>
      </Svg>

      <Animated.View
        style={{
          position: 'absolute',
          top: innerOffset,
          left: innerOffset,
          width: innerSize,
          height: innerSize,
          alignItems:'center',
          justifyContent:'center',
          transform: [{ scale: breathe }],
        }}
      >
        <Image
          source={PET_STATES[status].asset}
          style={{ width: innerSize, height: innerSize }}
          resizeMode="contain"
        />
      </Animated.View>

    </Animated.View>
  )
}
