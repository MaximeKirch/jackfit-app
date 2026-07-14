import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { OnboardingStep1Name }    from '../components/OnboardingStep1Name'
import { OnboardingStep2Sports }  from '../components/OnboardingStep2Sports'
import { OnboardingStep3Profile } from '../components/OnboardingStep3Profile'
import { useOnboarding } from '../hooks/useOnboarding'
import { Colors } from '@/shared/constants/tokens'
import type { SportId } from '@/shared/constants/sports'
import type { AthleteProfileKey } from '@/shared/constants/athleteProfiles'

type Step = 1 | 2 | 3

export default function OnboardingScreen() {
  const [step, setStep]           = useState<Step>(1)
  const [firstName, setFirstName] = useState('')
  const [mainSports, setMainSports] = useState<SportId[]>([])
  const { saveOnboarding, isLoading } = useOnboarding()

  const handleStep1 = (name: string) => {
    setFirstName(name)
    setStep(2)
  }

  const handleStep2 = (sports: SportId[]) => {
    setMainSports(sports)
    setStep(3)
  }

  const handleStep3 = async (profile: AthleteProfileKey) => {
    await saveOnboarding({ firstName, mainSports, athleteProfile: profile })
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
