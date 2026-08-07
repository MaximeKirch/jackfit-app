import { View, Text, StyleSheet, Pressable } from 'react-native'
import * as Haptics from 'expo-haptics';
import { useTranslation } from 'react-i18next'
import { usePetStore } from '@/shared/stores/petStore'
import { Colors, Radius, Typography } from '@/shared/constants/tokens'
import type { PetStatus as PetStatusType } from '@/shared/types/pet.types'
import { AntDesign } from '@react-native-vector-icons/ant-design';

const PILL_BG: Record<PetStatusType, string> = {
  NEW:         '#EDE9E4',
  PEAK:        '#E8F0E9',
  GOOD:        '#EFF4F0',
  TIRED:       '#F5EDDF',
  LAZY:        '#F3E6DF',
  OVERREACHED: '#F3DCD3',
}

interface PetStatusProps {
  toggleInfoModal: () => void
}

export const PetStatus = ({ toggleInfoModal }: PetStatusProps) => {
  const { t } = useTranslation()
  const status       = usePetStore((s) => s.status)
  const totalXp      = usePetStore((s) => s.totalXp)
  const currentStage = usePetStore((s) => s.currentStage)
  const textColor    = Colors.pet[status]
  const pillBg       = PILL_BG[status]

  return (
    <View style={[styles.pill, { backgroundColor: pillBg }]}>
      <Text style={[styles.text, { color: textColor }]}>
        {t(`stages.${currentStage}`)} · {totalXp} XP
      </Text>
      <Pressable
        onPress={() => {
          void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
          toggleInfoModal()
        }}
        style={{ justifyContent: 'center' }}>
        <AntDesign name='info-circle' color={textColor} size={12} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignSelf: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: Radius.full,
    marginTop: 14,
    gap: 4,
  },
  text: {
    fontFamily: 'Inter-Medium',
    fontSize: Typography.sm,
    letterSpacing: 0.2,
  },
})
