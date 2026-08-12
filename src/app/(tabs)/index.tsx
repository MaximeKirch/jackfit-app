import { useEffect, useRef, useState } from 'react'
import { View, StyleSheet} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { PetRing } from '@/features/pet/components/PetRing'
import { PetStatus } from '@/features/pet/components/PetStatus'
import { PetSpeechBubble } from '@/features/pet/components/PetSpeechBubble'
import { GaugesPanel } from '@/features/pet/components/GaugesPanel'
import { Skeleton } from '@/shared/components/Skeleton'
import { ErrorState } from '@/shared/components/ErrorState'
import { FadeInOnFocus } from '@/shared/components/FadeInOnFocus'
import { HealthPermissionDenied } from '@/features/health/components/HealthPermissionDenied'
import { usePetState } from '@/features/pet/hooks/usePetState'
import { usePetStore } from '@/shared/stores/petStore'
import { useUIStore } from '@/shared/stores/uiStore'
import { useNotifStore } from '@/shared/stores/notifStore'
import { getWelcomeMessage } from '@/features/pet/utils/welcomeMessage'
import { xpProgress } from '@/features/pet/utils/stages'
import { Colors, Spacing } from '@/shared/constants/tokens'


export default function HomeScreen() {
  const { t } = useTranslation()
  const {
    isLoading,
    isDataReady,
    hasFreshScore,
    error,
    refetch,
    permissionDenied,
    breakdown,
    justCompletedWorkout,
    hasEnoughData,
    daysWithData,
    daysRequired,
  } = usePetState()
  const status       = usePetStore((s) => s.status)
  const totalXp      = usePetStore((s) => s.totalXp)
  const currentStage = usePetStore((s) => s.currentStage)
  const getPreviousVisit = usePetStore((s) => s.getPreviousVisit)
  const recordVisit = usePetStore((s) => s.recordVisit)

  const ringProgress = xpProgress(totalXp, currentStage)

  const [welcomeText, setWelcomeText] = useState('')
  const hasWelcomedRef = useRef(false)
  const openInfoSheet = useUIStore((s) => s.openInfoSheet)
  const hasCompletedFirstWorkoutObserved = useNotifStore((s) => s.hasCompletedFirstWorkoutObserved)
  const markFirstWorkoutObserved         = useNotifStore((s) => s.markFirstWorkoutObserved)

  useEffect(() => {
    if (isLoading || !isDataReady || hasWelcomedRef.current) return
    hasWelcomedRef.current = true
    const previousVisit = getPreviousVisit()
    setWelcomeText(getWelcomeMessage(previousVisit))
    recordVisit()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isDataReady])

  const progressMessage = hasEnoughData
    ? undefined
    : t('home.progress.days_bubble', {
        received: Math.min(daysWithData, daysRequired),
        required: daysRequired,
      })

  const bubbleMessage = progressMessage ?? (welcomeText !== '' ? welcomeText : undefined)

  useEffect(() => {
    if (justCompletedWorkout && !hasCompletedFirstWorkoutObserved) {
      markFirstWorkoutObserved()
    }
  }, [justCompletedWorkout, hasCompletedFirstWorkoutObserved, markFirstWorkoutObserved])

  if (permissionDenied) {
    return (
      <SafeAreaView style={styles.container}>
        <FadeInOnFocus>
          <HealthPermissionDenied />
        </FadeInOnFocus>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <FadeInOnFocus>
          <ErrorState
            message={t('home.health_read_error')}
            onRetry={() => void refetch()}
          />
        </FadeInOnFocus>
      </SafeAreaView>
    )
  }

  if (isLoading || !hasFreshScore) {
    return (
      <SafeAreaView style={styles.container}>
        <FadeInOnFocus>
          <View style={styles.petSection}>
            <Skeleton width={240} height={240} borderRadius={120} />
            <View style={styles.gap16} />
            <Skeleton width={140} height={32} borderRadius={20} />
          </View>
          <View style={styles.bottomSection}>
            <View style={styles.gaugesSkeleton}>
              <Skeleton width="100%" height={14} borderRadius={7} />
              <Skeleton width="100%" height={14} borderRadius={7} />
              <Skeleton width="100%" height={14} borderRadius={7} />
            </View>
            <View style={styles.bubbleSkeletonWrap}>
              <Skeleton width={300} height={80} />
            </View>
          </View>
        </FadeInOnFocus>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FadeInOnFocus>
        <View style={styles.petSection}>
          <PetRing status={status} xpProgress={ringProgress} size={240} isCelebrating={justCompletedWorkout} />
          <PetStatus toggleInfoModal={openInfoSheet}/>
        </View>
        <View style={styles.bottomSection}>
          {breakdown && <GaugesPanel breakdown={breakdown} />}
          <PetSpeechBubble overrideMessage={bubbleMessage} />
        </View>
      </FadeInOnFocus>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.linen,
  },
  petSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomSection: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  gaugesSkeleton: {
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
  bubbleSkeletonWrap: {
    alignItems: 'center',
  },
  gap16: { height: 16 },
})
