import { useEffect, useRef } from 'react'
import { Stack, useGlobalSearchParams, usePathname, useRouter, useSegments } from 'expo-router'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { DMSerifDisplay_400Regular } from '@expo-google-fonts/dm-serif-display'
import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter'
import { DMMono_400Regular } from '@expo-google-fonts/dm-mono'
import * as SplashScreen from 'expo-splash-screen'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PostHogProvider } from 'posthog-react-native'
import { posthog } from '@/config/posthog'
import { queryClient } from '@/config/queryClient'
import { supabase } from '@/shared/lib/supabase'
import { useAuthStore } from '@/shared/stores/authStore'
import { usePetStore } from '@/shared/stores/petStore'
import { useNotifStore } from '@/shared/stores/notifStore'
import { InfoSheet } from '@/features/pet/components/InfoSheet/InfoSheet'
import { useDailyReminder } from '@/features/notifications/hooks/useDailyReminder'

const LAST_OPEN_KEY = '@posthog_last_open'

const TAB_SCREEN_NAMES: Record<string, string> = {
  '/':        'home',
  '/chat':    'chat',
  '/stats':   'stats',
  '/profile': 'profile',
}

SplashScreen.preventAutoHideAsync()

function AuthGuard() {
  const { user, isLoading, setUser, setSession, setIsLoading } = useAuthStore()
  const identifiedUserId = useRef<string | null>(null)
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (event === 'SIGNED_IN' && session?.user && identifiedUserId.current !== session.user.id) {
        identifiedUserId.current = session.user.id
        posthog.identify(session.user.id)
        posthog.capture('auth_signed_in')
      }

      if (event === 'SIGNED_OUT') {
        identifiedUserId.current = null
        posthog.reset()
        usePetStore.getState().reset()
        useNotifStore.getState().reset()
        queryClient.clear()
      }
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
    const inAIConsent = segments[0] === 'ai-consent'
    if (inTabs || inOnboarding || inAIConsent) return

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
  const pathname = usePathname()
  const params = useGlobalSearchParams()
  const previousPathname = useRef<string | undefined>(undefined)
  const [fontsLoaded] = useFonts({
    'DMSerifDisplay-Regular': DMSerifDisplay_400Regular,
    'Inter-Regular':          Inter_400Regular,
    'Inter-Medium':           Inter_500Medium,
    'Inter-SemiBold':         Inter_600SemiBold,
    'DMMono-Regular':         DMMono_400Regular,
  })

  useDailyReminder()

  useEffect(() => {
    if (fontsLoaded) void SplashScreen.hideAsync()
  }, [fontsLoaded])

  useEffect(() => {
    void (async () => {
      const lastOpen = await AsyncStorage.getItem(LAST_OPEN_KEY)
      const now = Date.now()
      const daysSince = lastOpen ? Math.floor((now - parseInt(lastOpen, 10)) / 86_400_000) : 0
      posthog.capture('app_opened', { days_since_last_open: daysSince })
      await AsyncStorage.setItem(LAST_OPEN_KEY, String(now))
    })()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      posthog.screen(pathname, { ...params })
      const screenName = TAB_SCREEN_NAMES[pathname]
      if (screenName) posthog.capture('screen_viewed', { screen_name: screenName })
      previousPathname.current = pathname
    }
  }, [pathname, params])

  if (!fontsLoaded) return null

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PostHogProvider
        client={posthog}
        autocapture={{ captureScreens: false, captureTouches: true, propsToCapture: ['testID'] }}
      >
        <QueryClientProvider client={queryClient}>
          <AuthGuard />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ai-consent" options={{ presentation: 'fullScreenModal' }} />
          </Stack>
          <InfoSheet />
        </QueryClientProvider>
      </PostHogProvider>
    </GestureHandlerRootView>
  )
}
