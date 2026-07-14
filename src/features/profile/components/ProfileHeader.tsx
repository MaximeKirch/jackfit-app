import { View, StyleSheet } from 'react-native'
import { Text } from '@/shared/components/Text'
import { PetAvatar } from '@/features/pet/components/PetAvatar'
import { usePetStore } from '@/shared/stores/petStore'
import { useAuthStore } from '@/shared/stores/authStore'
import { Colors, Spacing } from '@/shared/constants/tokens'

interface Props {
  firstName: string | null
}

export const ProfileHeader = ({ firstName }: Props) => {
  const status = usePetStore((state) => state.status)
  const user   = useAuthStore((state) => state.user)

  return (
    <View style={styles.container}>
      <PetAvatar status={status} size={80} />
      <Text variant="display" size="xl" style={styles.name}>
        {firstName ?? 'Mon profil'}
      </Text>
      <Text variant="body" size="sm" color={Colors.stone}>
        {user?.email}
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems:     'center',
    paddingVertical: Spacing.xl,
    gap:             Spacing.sm,
  },
  name: { color: Colors.charcoal },
})
