import { useEffect, useRef } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { Text } from '@/shared/components/Text'
import { TablerIcon } from '@/shared/components/TablerIcon'
import type { TablerIconName } from '@/shared/components/TablerIcon'
import { Colors, Spacing, Radius } from '@/shared/constants/tokens'

interface Props {
  icon: TablerIconName
  label: string
  value: number // 0-100
  disabled?: boolean
}

const getGaugeColor = (value: number): string => {
  if (value >= 70) return Colors.pet.PEAK
  if (value >= 40) return Colors.pet.GOOD
  return Colors.pet.TIRED
}

export const GaugeRow = ({ icon, label, value, disabled = false }: Props) => {
  const widthAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.timing(widthAnim, {
      toValue: disabled ? 0 : value,
      duration: 800,
      useNativeDriver: false,
    }).start()
  }, [value, disabled, widthAnim])

  const widthInterpolated = widthAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  })

  return (
    <View style={[styles.row, disabled && styles.rowDisabled]}>
      <TablerIcon name={icon} size={16} color={Colors.stone} />
      <Text variant="body" size="sm" color={Colors.stone} style={styles.label}>
        {label}
      </Text>
      <View style={styles.track}>
        {!disabled && (
          <Animated.View
            style={[styles.fill, { width: widthInterpolated, backgroundColor: getGaugeColor(value) }]}
          />
        )}
      </View>
      <Text
        variant="mono"
        size="xs"
        color={disabled ? Colors.stone : Colors.charcoal}
        style={styles.pct}
      >
        {disabled ? '—' : `${value}%`}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           Spacing.sm,
  },
  rowDisabled: {
    opacity: 0.5,
  },
  label: {
    width: 70,
  },
  track: {
    flex:            1,
    height:          6,
    backgroundColor: Colors.sand,
    borderRadius:    Radius.full,
    overflow:        'hidden',
  },
  fill: {
    height:       '100%',
    borderRadius: Radius.full,
  },
  pct: {
    width:     36,
    textAlign: 'right',
  },
})
