import { useEffect, useRef, useState } from 'react'
import { View, Pressable, Linking, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { PetRing } from '@/features/pet/components/PetRing'
import { PetStatus } from '@/features/pet/components/PetStatus'
import { PetSpeechBubble } from '@/features/pet/components/PetSpeechBubble'
import { GaugesPanel } from '@/features/pet/components/GaugesPanel'
import { Skeleton } from '@/shared/components/Skeleton'
import { ErrorState } from '@/shared/components/ErrorState'
import { Text } from '@/shared/components/Text'
import { usePetState } from '@/features/pet/hooks/usePetState'
import { usePetStore } from '@/shared/stores/petStore'
import { getWelcomeMessage } from '@/features/pet/utils/welcomeMessage'
import { xpProgress } from '@/features/pet/utils/stages'
import { Colors, Spacing, Radius } from '@/shared/constants/tokens'

export default function HomeScreen() {
  const { isLoading, isDataReady, error, refetch, permissionDenied, breakdown, justCompletedWorkout, hasEnoughData } = usePetState()
  const status       = usePetStore((s) => s.status)
  const totalXp      = usePetStore((s) => s.totalXp)
  const currentStage = usePetStore((s) => s.currentStage)
  const getPreviousVisit = usePetStore((s) => s.getPreviousVisit)
  const recordVisit = usePetStore((s) => s.recordVisit)

  const ringProgress = xpProgress(totalXp, currentStage)

  const [welcomeText, setWelcomeText] = useState('')
  const hasWelcomedRef = useRef(false)

  useEffect(() => {
    if (isLoading || !isDataReady || hasWelcomedRef.current) return
    hasWelcomedRef.current = true
    const previousVisit = getPreviousVisit()
    setWelcomeText(getWelcomeMessage(previousVisit, hasEnoughData))
    recordVisit()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isDataReady])

  if (permissionDenied) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text variant="display" size="lg" style={styles.permissionTitle}>
            Uma a besoin de tes données
          </Text>
          <Text size="base" color={Colors.stone} style={styles.permissionBody}>
            Sans accès à Apple Santé, Uma ne peut pas savoir comment tu vas.
          </Text>
          <Pressable
            onPress={() => void Linking.openSettings()}
            style={styles.permissionButton}
          >
            <Text weight="semibold" color={Colors.white}>
              Ouvrir les réglages
            </Text>
          </Pressable>
          <Text size="sm" color={Colors.stone} style={styles.permissionHint}>
            Réglages → Confidentialité → Santé → JackFit
          </Text>
        </View>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <ErrorState
          message="Impossible de lire les données de santé."
          onRetry={() => void refetch()}
        />
      </SafeAreaView>
    )
  }

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <Skeleton width={200} height={200} borderRadius={100} />
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
        <PetRing status={status} xpProgress={ringProgress} isCelebrating={justCompletedWorkout} />
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
  permissionContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  permissionTitle: {
    textAlign: 'center',
  },
  permissionBody: {
    textAlign: 'center',
    lineHeight: 22,
  },
  permissionButton: {
    marginTop: Spacing.sm,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: Radius.full,
    backgroundColor: Colors.moss,
  },
  permissionHint: {
    textAlign: 'center',
    lineHeight: 18,
  },
  gap16: { height: 16 },
  gap24: { height: 24 },
})
