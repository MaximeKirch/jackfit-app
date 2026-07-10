import { useRef, useEffect } from 'react'
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
import { useQuery } from '@tanstack/react-query'
import { useHealthData } from '@/features/health/hooks/useHealthData'
import { usePetStore } from '@/shared/stores/petStore'
import { PET_STATES } from '@/shared/types/pet.types'
import { Skeleton } from '@/shared/components/Skeleton'
import { useChat, MESSAGES_KEY } from '../hooks/useChat'
import { ChatBubble } from './ChatBubble'
import { ChatInput } from './ChatInput'
import type { Message } from '@/shared/types/chat.types'

const TypingIndicator = ({ color }: { color: string }) => (
  <View style={[styles.typingRow]}>
    <View style={[styles.typingBubble, { borderColor: color }]}>
      <Text style={styles.typingText}>…</Text>
    </View>
  </View>
)

export default function ChatList() {
  const { data: healthRaw, isLoading: healthLoading } = useHealthData()
  const status = usePetStore((s) => s.status)
  const score = usePetStore((s) => s.score)
  const { color } = PET_STATES[status]

  const healthData = healthRaw ? { ...healthRaw, weeklyScore: score } : null

  const { mutate: sendMessage, isPending } = useChat(healthData)

  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: MESSAGES_KEY,
    queryFn: (): Message[] => [],
    staleTime: Infinity,
    gcTime: Infinity,
  })


  console.log(messages)

  const listRef = useRef<FlatList<Message>>(null)

  useEffect(() => {
    if (messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true })
    }
  }, [messages.length])

  const renderItem: ListRenderItem<Message> = ({ item }) => (
    <ChatBubble message={item} accentColor={color} />
  )

  if (healthLoading) {
    return (
      <SafeAreaView style={styles.container} edges={['bottom']}>
        <View style={styles.loadingContainer}>
          <Skeleton width="90%" height={56} borderRadius={18} />
          <View style={styles.gap8} />
          <Skeleton width="70%" height={56} borderRadius={18} />
          <View style={styles.gap8} />
          <Skeleton width="85%" height={56} borderRadius={18} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>Commence une discussion ici</Text>
            </View>
          }
          ListFooterComponent={isPending ? <TypingIndicator color={color} /> : null}
        />
        <ChatInput onSend={sendMessage} isLoading={isPending} accentColor={color} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  flex: {
    flex: 1,
  },
  listContent: {
    paddingTop: 16,
    paddingBottom: 8,
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
    fontSize: 16,
    color: '#9E9E9E',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  typingRow: {
    paddingHorizontal: 16,
    marginVertical: 4,
    alignItems: 'flex-start',
  },
  typingBubble: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderRadius: 18,
    borderBottomLeftRadius: 4,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  typingText: {
    fontSize: 20,
    color: '#9E9E9E',
    letterSpacing: 4,
  },
  loadingContainer: {
    padding: 16,
    paddingTop: 24,
  },
  gap8: { height: 8 },
})
