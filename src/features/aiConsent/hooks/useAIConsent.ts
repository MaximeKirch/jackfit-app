import { useMutation, useQueryClient } from '@tanstack/react-query'
import { posthog } from '@/config/posthog'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/shared/stores/authStore'
import { useProfile, type UserProfile } from '@/features/profile/hooks/useProfile'

type ConsentSource = 'onboarding' | 'chat'

export const useAIConsent = () => {
  const user = useAuthStore((s) => s.user)
  const qc   = useQueryClient()
  const { profile, isLoading } = useProfile()

  const hasConsent = profile?.ai_consent_given_at != null

  const grantMutation = useMutation({
    mutationFn: async (source: ConsentSource) => {
      const timestamp = new Date().toISOString()
      const { error } = await supabase
        .from('profiles')
        .update({ ai_consent_given_at: timestamp, updated_at: timestamp })
        .eq('id', user!.id)
      if (error) throw error
      posthog.capture('ai_consent_granted', { source })
      return timestamp
    },
    onSuccess: (timestamp) => {
      qc.setQueryData<UserProfile>(['profile', user?.id], (old) =>
        old ? { ...old, ai_consent_given_at: timestamp } : old,
      )
      void qc.invalidateQueries({ queryKey: ['profile', user?.id] })
    },
  })

  return {
    hasConsent,
    isLoading,
    grantConsent: (source: ConsentSource) => grantMutation.mutateAsync(source),
    isGranting: grantMutation.isPending,
  }
}
