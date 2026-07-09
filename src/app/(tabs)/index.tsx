import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PetAvatar } from '@/features/pet/components/PetAvatar'
import { PetStatus } from '@/features/pet/components/PetStatus'
import { PetSpeechBubble } from '@/features/pet/components/PetSpeechBubble'
import { Skeleton } from '@/shared/components/Skeleton'
import { usePetState } from '@/features/pet/hooks/usePetState'

export default function HomeScreen() {
  const { isLoading, error } = usePetState()

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Impossible de lire les données HealthKit.</Text>
      </SafeAreaView>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Skeleton width={160} height={160} borderRadius={80} />
          <View style={styles.gap16} />
          <Skeleton width={140} height={32} borderRadius={20} />
          <View style={styles.gap24} />
          <Skeleton width={300} height={80} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <PetAvatar />
        <PetStatus />
        <PetSpeechBubble />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  error: {
    color: '#FF1744',
    textAlign: 'center',
    paddingHorizontal: 24,
    fontSize: 16,
  },
  gap16: { height: 16 },
  gap24: { height: 24 },
})
