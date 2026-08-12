import { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated'
import { Text } from '@/shared/components/Text'
import { Colors, Radius } from '@/shared/constants/tokens'

interface Props {
  label: string
  value: number // 0-100
  delay: number
  isOpen: boolean
  disabled?: boolean
}

const DURATION = 800

const getGaugeColor = (value: number): string => {
  if (value >= 70) return Colors.pet.PEAK
  if (value >= 40) return Colors.pet.GOOD
  return Colors.pet.TIRED
}

export const AnimatedGaugeRow = ({ label, value, delay, isOpen, disabled = false }: Props) => {
  const width = useSharedValue(0)

  useEffect(() => {
    if (isOpen && !disabled) {
      width.value = withDelay(
        delay,
        withTiming(value, { duration: DURATION, easing: Easing.out(Easing.cubic) }),
      )
    } else {
      width.value = 0
    }
  }, [isOpen, value, delay, width, disabled])

  const barStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }))

  return (
    <View style={[styles.row, disabled && styles.rowDisabled]}>
      <View style={styles.header}>
        <Text variant="body" size="sm" color={disabled ? Colors.stone : Colors.charcoal}>{label}</Text>
        <Text variant="mono" size="xs" color={Colors.stone}>{disabled ? '—' : `${value}%`}</Text>
      </View>
      <View style={styles.track}>
        {!disabled && (
          <Animated.View
            style={[styles.fill, barStyle, { backgroundColor: getGaugeColor(value) }]}
          />
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    gap: 6,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'baseline',
  },
  track: {
    height:          8,
    backgroundColor: Colors.linen,
    borderRadius:    Radius.full,
    overflow:        'hidden',
  },
  fill: {
    height:       '100%',
    borderRadius: Radius.full,
  },
})
