import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { posthog } from '@/config/posthog'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/shared/stores/authStore'
import { ATHLETE_PROFILES } from '@/shared/constants/athleteProfiles'
import type { SportId } from '@/shared/constants/sports'
import type { AthleteProfileKey } from '@/shared/constants/athleteProfiles'

export interface UserProfile {
  id: string
  first_name: string | null
  main_sports: SportId[]
  athlete_profile: AthleteProfileKey | null
  weekly_activity_goal: number
  weekly_activity_goal_hours: number | null
  current_weekly_volume: string | null
  sleep_goal: number
  goal_event_name: string | null
  goal_event_date: string | null
  ai_consent_given_at: string | null
}

export const useProfile = () => {
  const { t } = useTranslation()
  const user = useAuthStore((state) => state.user)
  const qc = useQueryClient()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user!.id)
        .single()
      if (error) throw error
      return data as UserProfile
    },
    enabled: !!user,
  })

  const updateMutation = useMutation({
    mutationFn: async (updates: Partial<UserProfile>) => {
      const { error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user!.id)
      if (error) throw error
    },
    onSuccess: (_data, updates) => {
      const updatedFields = Object.keys(updates).filter((field) => field !== 'first_name')
      posthog.capture('profile_updated', { updated_field_count: updatedFields.length })
      void qc.invalidateQueries({ queryKey: ['profile', user?.id] })
    },
  })

  const updateName = (firstName: string) =>
    updateMutation.mutateAsync({ first_name: firstName.trim() })

  const updateSports = (sports: SportId[]) =>
    updateMutation.mutateAsync({ main_sports: sports })

  const updateAthleteProfile = (key: AthleteProfileKey) => {
    const p = ATHLETE_PROFILES[key]
    return updateMutation.mutateAsync({
      athlete_profile:      key,
      weekly_activity_goal: p.weeklyActivityGoal,
      sleep_goal:           p.sleepGoal,
    })
  }

  const updateGoal = (goal: { name: string; date: string } | null) =>
    updateMutation.mutateAsync({
      goal_event_name: goal?.name ?? null,
      goal_event_date: goal?.date ?? null,
    })

  const updateWeeklyHours = (hours: number) =>
    updateMutation.mutateAsync({ weekly_activity_goal_hours: hours })

  const clearChat = async () => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('user_id', user!.id)
    if (error) throw error
    qc.setQueryData(['messages', user!.id], [])
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/auth')
  }

  const deleteAccount = () => {
    Alert.alert(
      t('profile.delete_account'),
      t('profile.delete_account_confirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('profile.delete'),
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase.functions.invoke('delete-account')
              if (error) throw error
              posthog.capture('account_deleted')
              await supabase.auth.signOut()
              router.replace('/auth')
            } catch (err) {
              posthog.captureException(err, { operation: 'account_delete' })
              Alert.alert(t('common.error'), t('profile.delete_account_error'))
            }
          },
        },
      ]
    )
  }

  return {
    profile,
    isLoading,
    isUpdating: updateMutation.isPending,
    updateName,
    updateSports,
    updateAthleteProfile,
    updateGoal,
    updateWeeklyHours,
    clearChat,
    signOut,
    deleteAccount,
  }
}
