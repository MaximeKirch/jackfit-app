import { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing, Radius, Shadow } from '@/shared/constants/tokens'
import { STAGES, stageInfo, nextStage, xpProgress } from '../utils/stages'
import type { StageName } from '../utils/stages'

interface Props {
  totalXp:          number
  currentStage:     StageName
  justChangedStage: boolean
}

export const ProgressionCard = ({ totalXp, currentStage, justChangedStage }: Props) => {
  const progress  = xpProgress(totalXp, currentStage)
  const current   = stageInfo(currentStage)
  const next      = nextStage(currentStage)
  const isMaxStage = next === null

  const barWidth = useRef(new Animated.Value(0)).current
  const glow     = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(barWidth, {
      toValue:         progress,
      duration:        800,
      delay:           200,
      useNativeDriver: false,
    }).start()
  }, [progress])

  useEffect(() => {
    if (!justChangedStage) return
    Animated.sequence([
      Animated.timing(glow, { toValue: 1, duration: 400, useNativeDriver: false }),
      Animated.timing(glow, { toValue: 0, duration: 800, useNativeDriver: false }),
    ]).start()
  }, [justChangedStage])

  const xpToNext = next ? next.minXp - totalXp : 0

  const glowColor = glow.interpolate({
    inputRange:  [0, 1],
    outputRange: ['transparent', Colors.pet.PEAK + '40'],
  })

  return (
    <Animated.View style={[styles.card, { backgroundColor: glowColor }]}>
      <View style={styles.inner}>
        <View style={styles.header}>
          <Text weight="semibold" size="base" color={Colors.charcoal}>
            {current.label}
          </Text>
          <Text size="sm" color={Colors.stone}>
            {totalXp} XP
          </Text>
        </View>

        <View style={styles.track}>
          <Animated.View
            style={[
              styles.fill,
              {
                width: barWidth.interpolate({
                  inputRange:  [0, 1],
                  outputRange: ['0%', '100%'],
                }),
              },
            ]}
          />
        </View>

        <View style={styles.footer}>
          {isMaxStage ? (
            <Text size="xs" color={Colors.moss}>
              Stade maximum atteint
            </Text>
          ) : (
            <>
              <Text size="xs" color={Colors.stone}>
                {STAGES.map((s) => s.name).indexOf(currentStage) + 1} / {STAGES.length}
              </Text>
              <Text size="xs" color={Colors.stone}>
                {xpToNext} XP jusqu'à {next.label}
              </Text>
            </>
          )}
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  card: {
    borderRadius:    Radius.lg,
    backgroundColor: Colors.sand,
    ...Shadow.soft,
    overflow: 'hidden',
  },
  inner: {
    padding: Spacing.md,
    gap:     Spacing.sm,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'baseline',
  },
  track: {
    height:          6,
    borderRadius:    3,
    backgroundColor: Colors.linen,
    overflow:        'hidden',
  },
  fill: {
    height:          6,
    borderRadius:    3,
    backgroundColor: Colors.moss,
  },
  footer: {
    flexDirection:  'row',
    justifyContent: 'space-between',
  },
})
