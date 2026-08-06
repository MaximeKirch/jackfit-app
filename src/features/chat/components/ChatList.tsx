import { useRef, useCallback, useEffect } from 'react'
import {
  FlatList,
  View,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  type ListRenderItem,
} from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { FadeInOnFocus } from '@/shared/components/FadeInOnFocus'
import { useHealthData } from '@/features/health/hooks/useHealthData'
import { useAIConsent } from '@/features/aiConsent/hooks/useAIConsent'
import { usePetStore } from '@/shared/stores/petStore'
import { PET_STATES } from '@/shared/types/pet.types'
import { ErrorState } from '@/shared/components/ErrorState'
import { HealthPermissionDenied } from '@/features/health/components/HealthPermissionDenied'
import { Colors, Spacing, Typography } from '@/shared/constants/tokens'
import { useChat, useMessages } from '../hooks/useChat'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import { ChatSkeleton } from './ChatSkeleton'
import type { Message } from '@/shared/types/chat.types'

const TypingDot = ({ delay, color }: { delay: number; color: string }) => {
  const opacity = useSharedValue(0.3)

  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 400 }),
          withTiming(0.3, { duration: 400 }),
        ),
        -1,
        false,
      ),
    )
  }, [delay, opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return <Animated.View style={[styles.typingDot, { backgroundColor: color }, animatedStyle]} />
}

const TypingIndicator = ({ color }: { color: string }) => (
  <View style={styles.typingRow}>
    <View style={[styles.typingBubble, { borderColor: color }]}>
      <TypingDot delay={0}   color={color} />
      <TypingDot delay={150} color={color} />
      <TypingDot delay={300} color={color} />
    </View>
  </View>
)

export default function ChatList() {
  const { t } = useTranslation()
  const { data: healthRaw, isLoading: healthLoading, error: healthError, refetch: refetchHealth, permissionDenied: healthDenied } = useHealthData()
  const { hasConsent, isLoading: consentLoading } = useAIConsent()
  const status = usePetStore((s) => s.status)
  const score  = usePetStore((s) => s.score)
  const { color } = PET_STATES[status]


  const healthData = healthRaw ? { ...healthRaw, weeklyScore: score } : null

  const { mutate: sendMessage, isPending, retryLastMessage } = useChat(healthData)
  const { data: messages = [], isLoading: messagesLoading, isError: messagesError, refetch: refetchMessages } = useMessages()

  const listRef = useRef<FlatList<Message>>(null)
  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: false }))
  }, [])


  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <ChatBubble
      message={item}
      onRetry={item.isFailed === true ? retryLastMessage : undefined}
    />
  )

  useEffect(() => {
    if (!consentLoading && !hasConsent) {
      router.push('/ai-consent')
    }
  }, [consentLoading, hasConsent])

  if (!consentLoading && !hasConsent) {
    return <SafeAreaView style={styles.container} edges={['top']} />
  }

  if (healthDenied) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <FadeInOnFocus>
          <HealthPermissionDenied body={t('chat.no_health_access')} />
        </FadeInOnFocus>
      </SafeAreaView>
    )
  }

  if (healthError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <FadeInOnFocus>
          <ErrorState
            message={t('chat.health_read_error')}
            onRetry={() => void refetchHealth()}
          />
        </FadeInOnFocus>
      </SafeAreaView>
    )
  }

  if (messagesError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <FadeInOnFocus>
          <ErrorState
            message={t('chat.connection_error')}
            onRetry={() => void refetchMessages()}
          />
        </FadeInOnFocus>
      </SafeAreaView>
    )
  }

  if (healthLoading || messagesLoading) {
    return <ChatSkeleton />
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={0}
      >
        <FadeInOnFocus>
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
            onContentSizeChange={scrollToBottom}
            onLayout={scrollToBottom}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('chat.empty_state')}</Text>
              </View>
            }
            ListFooterComponent={isPending ? <TypingIndicator color={color} /> : null}
          />
        </FadeInOnFocus>
        <ChatInput onSend={sendMessage} isLoading={isPending} accentColor={color} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.linen,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyText: {
    fontFamily: 'Inter-Regular',
    fontSize: Typography.base,
    color: Colors.stone,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  typingRow: {
    paddingHorizontal: Spacing.md,
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  typingBubble: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  typingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
})
