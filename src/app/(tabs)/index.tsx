import { useEffect, useState } from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PetAvatar } from '@/features/pet/components/PetAvatar'
import { PetStatus } from '@/features/pet/components/PetStatus'
import { PetSpeechBubble } from '@/features/pet/components/PetSpeechBubble'
import { GaugesPanel } from '@/features/pet/components/GaugesPanel'
import { Skeleton } from '@/shared/components/Skeleton'
import { usePetState } from '@/features/pet/hooks/usePetState'
import { usePetStore } from '@/shared/stores/petStore'
import { getWelcomeMessage } from '@/features/pet/utils/welcomeMessage'
import { Colors, Spacing, Typography } from '@/shared/constants/tokens'

export default function HomeScreen() {
  const { isLoading, error, breakdown, justCompletedWorkout } = usePetState()
  const status = usePetStore((s) => s.status)
  const getPreviousVisit = usePetStore((s) => s.getPreviousVisit)
  const recordVisit = usePetStore((s) => s.recordVisit)

  const [welcomeText, setWelcomeText] = useState('')

  useEffect(() => {
    const previousVisit = getPreviousVisit()
    setWelcomeText(getWelcomeMessage(previousVisit))
    recordVisit()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
        <PetAvatar status={status} isCelebrating={justCompletedWorkout} />
        <PetStatus />
        {breakdown && (
          <View style={styles.gauges}>
            <GaugesPanel breakdown={breakdown} />
          </View>
        )}
        <PetSpeechBubble overrideMessage={welcomeText !== '' ? welcomeText : undefined} />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.linen,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gauges: {
    width: '100%',
    marginTop: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  error: {
    fontFamily: 'Inter-Regular',
    fontSize: Typography.base,
    color: '#FF1744',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  gap16: { height: 16 },
  gap24: { height: 24 },
})
