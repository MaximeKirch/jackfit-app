import { env } from '@/config/env'
import { supabase } from '@/shared/lib/supabase'
import type { HealthSummary } from '@/shared/types/health.types'
import type { Message } from '@/shared/types/chat.types'

export class RateLimitError extends Error {
  constructor(
    public readonly limit: number,
    public readonly resetAt: string,
  ) {
    super('rate_limit_exceeded')
    this.name = 'RateLimitError'
  }
}

export const fetchMessages = async (userId: string): Promise<Message[]> => {
  const { data, error } = await supabase
    .from('messages')
    .select('id, role, content, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(50)

  if (error) throw error

  return (data ?? []).map((row) => ({
    id: row.id as string,
    role: row.role as 'user' | 'assistant',
    content: row.content as string,
    createdAt: row.created_at as string,
  }))
}

export const sendMessage = async (
  message: string,
  healthData: HealthSummary,
  weeklyScore = 65,
): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ message, weeklyScore, healthData }),
  })

  if (response.status === 429) {
    const data = await response.json() as { error: string; limit: number; reset_at: string }
    throw new RateLimitError(data.limit, data.reset_at)
  }

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = (await response.json()) as { message: string }
  return data.message
}
