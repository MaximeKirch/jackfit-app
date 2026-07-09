import { z } from 'zod'

const envSchema = z.object({
  EXPO_PUBLIC_API_URL: z.string().url().default('http://localhost:3000'),
  EXPO_PUBLIC_SUPABASE_URL: z.string().url(),
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
})

export const env = envSchema.parse({
  EXPO_PUBLIC_API_URL: process.env['EXPO_PUBLIC_API_URL'],
  EXPO_PUBLIC_SUPABASE_URL: process.env['EXPO_PUBLIC_SUPABASE_URL'],
  EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env['EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY'],
})
