import { useEffect } from 'react'
import { Stack, useRouter, useSegments } from 'expo-router'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter'
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono'
import * as SplashScreen from 'expo-splash-screen'
import { queryClient } from '@/config/queryClient'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/shared/stores/authStore'

SplashScreen.preventAutoHideAsync()

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

    if (!user) {
      if (segments[0] !== 'auth') router.replace('/auth')
      return
    }

    const inTabs = segments[0] === '(tabs)'
    const inOnboarding = segments[0] === 'onboarding'
    if (inTabs || inOnboarding) return

    void supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (!data?.onboarding_completed) {
          router.replace('/onboarding')
        } else {
          router.replace('/(tabs)')
        }
      })
  }, [user, isLoading, segments, router])

  return null
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'DMSerifDisplay-Regular': DMSerifDisplay_400Regular,
    'Inter-Regular':          Inter_400Regular,
    'Inter-Medium':           Inter_500Medium,
    'Inter-SemiBold':         Inter_600SemiBold,
    'DMMono-Regular':         DMMono_400Regular,
  })

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync()
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <QueryClientProvider client={queryClient}>
      <AuthGuard />
      <Stack screenOptions={{ headerShown: false }} />
    </QueryClientProvider>
  )
}
