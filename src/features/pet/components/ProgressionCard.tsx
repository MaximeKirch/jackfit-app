import { useEffect, useRef } from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing, Radius, Shadow } from '@/shared/constants/tokens'
import { STAGES, nextStage, xpProgress } from '../utils/stages'
import type { StageName } from '../utils/stages'

interface Props {
  totalXp:          number
  currentStage:     StageName
  justChangedStage: boolean
}

export const ProgressionCard = ({ totalXp, currentStage, justChangedStage }: Props) => {
  const { t } = useTranslation()
  const progress   = xpProgress(totalXp, currentStage)
  const next       = nextStage(currentStage)
  const isMaxStage = next === null
  const currentIdx = STAGES.findIndex((s) => s.name === currentStage)

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

  const xpToNext  = next ? next.minXp - totalXp : 0
  const glowColor = glow.interpolate({
    inputRange:  [0, 1],
    outputRange: [Colors.sand, Colors.pet.PEAK + 'CC'],
  })

  return (
    <Animated.View style={[styles.card, { backgroundColor: glowColor }]}>
      <View style={styles.inner}>
        {/* Stage name + XP total */}
        <View style={styles.header}>
          <Text weight="semibold" size="base" color={Colors.charcoal}>
            {t(`stages.${currentStage}`)}
          </Text>
          <Text size="sm" color={Colors.stone}>
            {totalXp} XP
          </Text>
        </View>

        {/* Progress bar */}
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

        {/* 5-stage milestone dots */}
        <View style={styles.dotsRow}>
          {STAGES.map((stage, idx) => (
            <View key={stage.name} style={styles.dotItem}>
              <View
                style={[
                  styles.dot,
                  idx <= currentIdx ? styles.dotReached : styles.dotPending,
                  idx === currentIdx && styles.dotCurrent,
                ]}
              />
              <Text
                size="xs"
                color={idx <= currentIdx ? Colors.moss : Colors.stone}
                style={styles.dotLabel}
                numberOfLines={1}
              >
                {t(`stages.${stage.name}`)}
              </Text>
            </View>
          ))}
        </View>

        {/* XP to next */}
        <View style={styles.footer}>
          {isMaxStage ? (
            <Text size="xs" color={Colors.moss}>
              {t('home.progression.max_stage')}
            </Text>
          ) : (
            <Text size="xs" color={Colors.stone}>
              {t('home.progression.xp_to_next', { xp: xpToNext, next: t(`stages.${next.name}`) })}
            </Text>
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
  dotsRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    paddingTop:     Spacing.xs,
  },
  dotItem: {
    alignItems: 'center',
    gap:        4,
    flex:       1,
  },
  dot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  dotReached: {
    backgroundColor: Colors.moss,
  },
  dotPending: {
    backgroundColor: Colors.sand,
    borderWidth:     1,
    borderColor:     Colors.stone,
  },
  dotCurrent: {
    width:        10,
    height:       10,
    borderRadius: 5,
  },
  dotLabel: {
    textAlign: 'center',
    fontSize:  9,
  },
  footer: {
    paddingTop: Spacing.xs,
  },
})
