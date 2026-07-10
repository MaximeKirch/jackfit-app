import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/tokens'
import { useAuthStore } from '@/shared/stores/authStore'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function ProfileScreen() {
  const { user } = useAuthStore()
  const { signOut } = useAuth()

  const handleSignOut = () => {
    Alert.alert('Déconnexion', 'Tu veux vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Se déconnecter', style: 'destructive', onPress: () => { void signOut() } },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inner}>
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarEmoji}>🐾</Text>
          </View>
          <Text style={styles.email}>{user?.email ?? '—'}</Text>
        </View>

        <Pressable style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonLabel}>Se déconnecter</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.linen,
  },
  inner: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'space-between',
    paddingBottom: Spacing.lg,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 48,
    gap: Spacing.sm,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 36,
  },
  email: {
    fontFamily: 'Inter-Regular',
    fontSize: Typography.base,
    color: Colors.stone,
  },
  button: {
    height: 52,
    backgroundColor: Colors.sand,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Typography.base,
    color: '#FF1744',
  },
})
