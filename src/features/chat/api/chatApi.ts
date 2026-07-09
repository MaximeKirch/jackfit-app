import { env } from '@/config/env'
import type { HealthSummary } from '@/shared/types/health.types'

const USER_ID = 'jackfit-user'

export const sendMessage = async (message: string, healthData: HealthSummary): Promise<string> => {
  const response = await fetch(`${env.EXPO_PUBLIC_API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: USER_ID, message, healthData }),
  })

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`)
  }

  const data = (await response.json()) as { message: string }
  return data.message
}
