import { View, Text, StyleSheet } from 'react-native'
import { usePetStore } from '@/shared/stores/petStore'
import { PET_STATES } from '@/shared/types/pet.types'
import { Colors, Typography } from '@/shared/constants/tokens'
import type { PetStatus as PetStatusType } from '@/shared/types/pet.types'

const PILL_BG: Record<PetStatusType, string> = {
  PEAK:        '#E8F0E9',
  GOOD:        '#EFF4F0',
  TIRED:       '#F5EDDF',
  LAZY:        '#F3E6DF',
  OVERREACHED: '#F3DCD3',
}

export const PetStatus = () => {
  const status = usePetStore((s) => s.status)
  const score  = usePetStore((s) => s.score)
  const { label } = PET_STATES[status]
  const textColor  = Colors.pet[status]
  const pillBg     = PILL_BG[status]

  return (
    <View style={[styles.pill, { backgroundColor: pillBg }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {label} · {score}/100
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginTop: 10,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: Typography.xs,
    letterSpacing: 0.1,
  },
})
