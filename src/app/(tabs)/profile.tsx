import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useAuthStore } from '@/shared/stores/authStore'
import { useAuth } from '@/features/auth/hooks/useAuth'

export default function ProfileScreen() {
  const { user } = useAuthStore()
  const { signOut } = useAuth()

  const handleSignOut = () => {
    Alert.alert('Déconnexion', 'Tu veux vraiment te déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Se déconnecter',
        style: 'destructive',
        onPress: () => { void signOut() },
      },
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
    backgroundColor: '#FFFFFF',
  },
  inner: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
    paddingBottom: 24,
  },
  avatarContainer: {
    alignItems: 'center',
    paddingTop: 48,
    gap: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarEmoji: {
    fontSize: 36,
  },
  email: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  button: {
    height: 52,
    backgroundColor: '#F5F5F5',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF1744',
  },
})
