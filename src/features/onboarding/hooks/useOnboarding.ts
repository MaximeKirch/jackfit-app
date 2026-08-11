import { useState } from 'react'
import { posthog } from '@/config/posthog'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/shared/stores/authStore'
import { ATHLETE_PROFILES, type AthleteProfileKey } from '@/shared/constants/athleteProfiles'
import type { SportId } from '@/shared/constants/sports'
import type { WeeklyVolumeBucket } from '@/shared/constants/weeklyVolume'
import { volumeToTargetHours } from '@/shared/constants/weeklyVolume'
import type { GoalValue } from '../components/OnboardingStep4Goal'
import type { VolumeChoice } from '../components/OnboardingStepVolume'

interface OnboardingData {
  firstName: string
  mainSports: SportId[]
  athleteProfile: AthleteProfileKey | null
  volume: VolumeChoice | null
  goal: GoalValue
  aiConsentGranted: boolean
}

export const useOnboarding = () => {
  const user = useAuthStore((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)

  const saveOnboarding = async (data: OnboardingData) => {
    if (!user || !data.athleteProfile) return

    setIsLoading(true)

    try {
      const profile = ATHLETE_PROFILES[data.athleteProfile]
      const now     = new Date().toISOString()

      const volumeBucket: WeeklyVolumeBucket | null =
        data.volume && data.volume !== 'unknown' ? data.volume : null
      const goalHours = volumeToTargetHours(volumeBucket)

      const { error } = await supabase
        .from('profiles')
        .update({
          first_name:                 data.firstName.trim(),
          main_sports:                data.mainSports,
          athlete_profile:            data.athleteProfile,
          weekly_activity_goal:       profile.weeklyActivityGoal,
          sleep_goal:                 profile.sleepGoal,
          current_weekly_volume:      volumeBucket,
          weekly_activity_goal_hours: goalHours,
          goal_event_name:            data.goal?.name ?? null,
          goal_event_date:            data.goal?.date ?? null,
          onboarding_completed:       true,
          ai_consent_given_at:        data.aiConsentGranted ? now : null,
          updated_at:                 now,
        })
        .eq('id', user.id)

      if (error) throw error
      posthog.capture('onboarding_completed', {
        athlete_profile:     data.athleteProfile,
        sport_count:         data.mainSports.length,
        weekly_volume:       data.volume ?? 'unknown',
        has_goal:            data.goal !== null,
        ai_consent_granted:  data.aiConsentGranted,
      })
      if (data.aiConsentGranted) {
        posthog.capture('ai_consent_granted', { source: 'onboarding' })
      }
    } catch (error) {
      posthog.captureException(error, { operation: 'onboarding_save' })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return { saveOnboarding, isLoading }
}
