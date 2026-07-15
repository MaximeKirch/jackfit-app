import { env } from '@/config/env'
import { supabase } from '@/shared/lib/supabase'
import type { HealthSummary } from '@/shared/types/health.types'
import type { ScoreResult } from '@/features/pet/utils/scoring'

export const syncScore = async (healthData: HealthSummary): Promise<ScoreResult> => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/score`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ healthData }),
  })

  if (!response.ok) throw new Error(`Score API error: ${response.status}`)

  return (await response.json()) as ScoreResult
}
