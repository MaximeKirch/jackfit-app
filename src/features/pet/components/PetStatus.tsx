import { View, Text, StyleSheet } from 'react-native'
import { usePetStore } from '@/shared/stores/petStore'
import { PET_STATES } from '@/shared/types/pet.types'
import { stageInfo } from '@/features/pet/utils/stages'
import { Colors, Typography } from '@/shared/constants/tokens'
import type { PetStatus as PetStatusType } from '@/shared/types/pet.types'

const PILL_BG: Record<PetStatusType, string> = {
  NEW:         '#EDE9E4',
  PEAK:        '#E8F0E9',
  GOOD:        '#EFF4F0',
  TIRED:       '#F5EDDF',
  LAZY:        '#F3E6DF',
  OVERREACHED: '#F3DCD3',
}

export const PetStatus = () => {
  const status       = usePetStore((s) => s.status)
  const totalXp      = usePetStore((s) => s.totalXp)
  const currentStage = usePetStore((s) => s.currentStage)
  const { label }    = PET_STATES[status]
  const textColor    = Colors.pet[status]
  const pillBg       = PILL_BG[status]
  const stage        = stageInfo(currentStage)

  return (
    <View style={[styles.pill, { backgroundColor: pillBg }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {stage.label} · {totalXp} XP
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    alignSelf: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginTop: 14,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: Typography.sm,
    letterSpacing: 0.2,
  },
})
