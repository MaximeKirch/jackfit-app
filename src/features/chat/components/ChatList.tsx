import { useRef, useCallback, useEffect } from 'react'
import {
  FlatList,
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  type ListRenderItem,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
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

const TypingIndicator = ({ color }: { color: string }) => (
  <View style={styles.typingRow}>
    <View style={[styles.typingBubble, { borderColor: color }]}>
      <Text style={styles.typingText}>…</Text>
    </View>
  </View>
)

export default function ChatList() {
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
          <HealthPermissionDenied
            body="Sans accès à Apple Santé, Uma ne peut pas discuter avec toi de ta forme."
          />
        </FadeInOnFocus>
      </SafeAreaView>
    )
  }

  if (healthError) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <FadeInOnFocus>
          <ErrorState
            message="Impossible de lire les données de santé."
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
            message="Uma n'arrive pas à se connecter. Vérifie ta connexion."
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
                <Text style={styles.emptyText}>Commence une discussion ici</Text>
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
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  typingText: {
    fontSize: Typography.lg,
    color: Colors.stone,
    letterSpacing: 4,
  },
})
