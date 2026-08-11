import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { posthog } from '@/config/posthog'
import { OnboardingStep1Name }    from '../components/OnboardingStep1Name'
import { OnboardingStep2Sports }  from '../components/OnboardingStep2Sports'
import { OnboardingStep3Profile } from '../components/OnboardingStep3Profile'
import { OnboardingStepVolume, type VolumeChoice } from '../components/OnboardingStepVolume'
import { OnboardingStep4Goal, type GoalValue } from '../components/OnboardingStep4Goal'
import { OnboardingStep4Consent } from '../components/OnboardingStep4Consent'
import { useOnboarding } from '../hooks/useOnboarding'
import { Colors } from '@/shared/constants/tokens'
import type { SportId } from '@/shared/constants/sports'
import type { AthleteProfileKey } from '@/shared/constants/athleteProfiles'

type Step = 1 | 2 | 3 | 4 | 5 | 6

export default function OnboardingScreen() {
  const [step, setStep]           = useState<Step>(1)
  const [firstName, setFirstName] = useState('')
  const [mainSports, setMainSports] = useState<SportId[]>([])
  const [athleteProfile, setAthleteProfile] = useState<AthleteProfileKey | null>(null)
  const [volume, setVolume] = useState<VolumeChoice | null>(null)
  const [goal, setGoal] = useState<GoalValue>(null)
  const { saveOnboarding, isLoading } = useOnboarding()

  const handleStep1 = (name: string) => {
    posthog.capture('onboarding_step_completed', { step: 'first_name' })
    setFirstName(name)
    setStep(2)
  }

  const handleStep2 = (sports: SportId[]) => {
    posthog.capture('onboarding_step_completed', { step: 'sports' })
    setMainSports(sports)
    setStep(3)
  }

  const handleStep3 = (profile: AthleteProfileKey) => {
    posthog.capture('onboarding_step_completed', { step: 'athlete_profile' })
    setAthleteProfile(profile)
    setStep(4)
  }

  const handleStep4 = (choice: VolumeChoice) => {
    posthog.capture('onboarding_step_completed', { step: 'weekly_volume', volume: choice })
    setVolume(choice)
    setStep(5)
  }

  const handleStep5 = (nextGoal: GoalValue) => {
    posthog.capture('onboarding_step_completed', { step: 'goal', has_goal: nextGoal !== null })
    setGoal(nextGoal)
    setStep(6)
  }

  const finishOnboarding = async (aiConsentGranted: boolean) => {
    if (!athleteProfile) return
    posthog.capture('onboarding_step_completed', { step: 'ai_consent', granted: aiConsentGranted })
    await saveOnboarding({ firstName, mainSports, athleteProfile, volume, goal, aiConsentGranted })
    router.replace('/(tabs)')
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        {step === 1 && (
          <OnboardingStep1Name onNext={handleStep1} />
        )}
        {step === 2 && (
          <OnboardingStep2Sports
            onNext={handleStep2}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <OnboardingStep3Profile
            firstName={firstName}
            onNext={handleStep3}
            onBack={() => setStep(2)}
            isLoading={false}
          />
        )}
        {step === 4 && (
          <OnboardingStepVolume
            initial={volume}
            onNext={handleStep4}
            onBack={() => setStep(3)}
          />
        )}
        {step === 5 && (
          <OnboardingStep4Goal
            initial={goal}
            onNext={handleStep5}
            onBack={() => setStep(4)}
          />
        )}
        {step === 6 && (
          <OnboardingStep4Consent
            onAccept={() => { void finishOnboarding(true) }}
            onDecline={() => { void finishOnboarding(false) }}
            onBack={() => setStep(5)}
            isLoading={isLoading}
          />
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe:      { flex: 1, backgroundColor: Colors.linen },
  container: { flex: 1, paddingHorizontal: 24 },
})
