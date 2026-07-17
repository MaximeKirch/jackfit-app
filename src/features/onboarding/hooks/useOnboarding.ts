import { useState } from 'react'
import { posthog } from '@/config/posthog'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/shared/stores/authStore'
import { ATHLETE_PROFILES, type AthleteProfileKey } from '@/shared/constants/athleteProfiles'
import type { SportId } from '@/shared/constants/sports'

interface OnboardingData {
  firstName: string
  mainSports: SportId[]
  athleteProfile: AthleteProfileKey | null
}

export const useOnboarding = () => {
  const user = useAuthStore((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)

  const saveOnboarding = async (data: OnboardingData) => {
    if (!user || !data.athleteProfile) return

    setIsLoading(true)

    try {
      const profile = ATHLETE_PROFILES[data.athleteProfile]

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name:           data.firstName.trim(),
          main_sports:          data.mainSports,
          athlete_profile:      data.athleteProfile,
          weekly_activity_goal: profile.weeklyActivityGoal,
          sleep_goal:           profile.sleepGoal,
          onboarding_completed: true,
          updated_at:           new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error
      posthog.capture('onboarding_completed', {
        athlete_profile: data.athleteProfile,
        sport_count: data.mainSports.length,
      })
    } catch (error) {
      posthog.captureException(error, { operation: 'onboarding_save' })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { saveOnboarding, isLoading }
}
