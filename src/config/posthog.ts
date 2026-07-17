import PostHog from 'posthog-react-native'
import { env } from '@/config/env'

export const posthog = new PostHog(env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN, {
  host: env.EXPO_PUBLIC_POSTHOG_HOST,
})
