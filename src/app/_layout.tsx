import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '@/config/queryClient'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/shared/stores/authStore'

function AuthGuard() {
  const { user, isLoading, setUser, setSession, setIsLoading } = useAuthStore()
  const router = useRouter()
  const segments = useSegments()

  useEffect(() => {
    void supabase.auth.getUser().then(({ data: { user }, error }) => {
      if (error ?? !user) {
        void supabase.auth.signOut()
        setSession(null)
        setUser(null)
      } else {
        setUser(user)
      }
      setIsLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (isLoading) return
    const inAuthScreen = segments[0] === 'auth'

    if (!user && !inAuthScreen) {
      router.replace('/auth')
    } else if (user && inAuthScreen) {
      router.replace('/')
    }
  }, [user, isLoading, segments, router])

  return null
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  )
}
