import { View, StyleSheet } from 'react-native'
import { Text } from '@/shared/components/Text'
import { useAuthStore } from '@/shared/stores/authStore'
import { Colors, Spacing } from '@/shared/constants/tokens'

interface Props {
  firstName: string | null
}

export const ProfileHeader = ({ firstName }: Props) => {
  const user   = useAuthStore((state) => state.user)

  return (
    <View style={styles.container}>
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
