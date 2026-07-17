import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Alert } from 'react-native'
import { router } from 'expo-router'
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
  sleep_goal: number
}

export const useProfile = () => {
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

  const clearChat = async () => {
    const { error } = await supabase
      .from('messages')
      .delete()
      .eq('user_id', user!.id)
    if (error) throw error
    qc.setQueryData(['messages'], [])
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.replace('/auth')
  }

  const deleteAccount = () => {
    Alert.alert(
      'Supprimer le compte',
      'Cette action est irréversible. Ton compte et toutes tes données seront supprimés définitivement.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            posthog.capture('account_deleted')
            await supabase.from('messages').delete().eq('user_id', user!.id)
            await supabase.from('profiles').delete().eq('id', user!.id)
            await supabase.auth.signOut()
            router.replace('/auth')
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
    clearChat,
    signOut,
    deleteAccount,
  }
}
