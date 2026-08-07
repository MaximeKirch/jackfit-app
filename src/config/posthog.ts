import PostHog from 'posthog-react-native'
import { env } from '@/config/env'

const token = env.EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = env.EXPO_PUBLIC_POSTHOG_HOST

export const posthog: PostHog =
  token && host
    ? new PostHog(token, { host })
    : (new Proxy({}, { get: () => () => {} }) as unknown as PostHog)
