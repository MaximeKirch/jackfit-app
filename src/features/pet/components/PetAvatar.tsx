import { View, StyleSheet } from 'react-native'
import { usePetStore } from '@/shared/stores/petStore'
import { PET_STATES } from '@/shared/types/pet.types'

export const PetAvatar = () => {
  const status = usePetStore((s) => s.status)
  const { color } = PET_STATES[status]

  return <View style={[styles.circle, { backgroundColor: color }]} />
}

const styles = StyleSheet.create({
  circle: {
    width: 160,
    height: 160,
    borderRadius: 80,
  },
})
