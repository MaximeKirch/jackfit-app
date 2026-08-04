import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as Haptics from 'expo-haptics'
import { sendMessage, fetchMessages, RateLimitError } from '../api/chatApi'
import { posthog } from '@/config/posthog'
import { useAuthStore } from '@/shared/stores/authStore'
import { usePetStore } from '@/shared/stores/petStore'
import type { HealthSummary } from '@/shared/types/health.types'
import type { Message } from '@/shared/types/chat.types'

export const messagesKey = (userId: string) => ['messages', userId] as const

export const useMessages = () => {
  const user = useAuthStore((state) => state.user)

  return useQuery<Message[]>({
    queryKey: messagesKey(user?.id ?? ''),
    enabled: !!user,
    queryFn: () => fetchMessages(user!.id),
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

const RATE_LIMIT_MESSAGE: Message = {
  id: 'rate-limit-uma',
  role: 'assistant',
  content: "Uma se repose pour aujourd'hui. Reviens demain, j'aurai rechargé les batteries.",
  createdAt: new Date().toISOString(),
}

export const useChat = (healthData: HealthSummary | null) => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const weeklyScore = usePetStore((s) => s.score)
  const lastFailedContent = useRef<string | null>(null)

  const mutation = useMutation({
    mutationFn: (message: string) => {
      if (!healthData) throw new Error('Health data not available')
      if (!user) throw new Error('Not authenticated')
      return sendMessage(message, healthData, weeklyScore)
    },

    onMutate: async (message: string) => {
      if (!user) return
      const key = messagesKey(user.id)
      await queryClient.cancelQueries({ queryKey: key })
      const previousMessages = queryClient.getQueryData<Message[]>(key)

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      }

      queryClient.setQueryData<Message[]>(key, (old = []) => [
        ...old.filter((m) => !m.isFailed),
        optimisticMessage,
      ])

      return { previousMessages }
    },

    onSuccess: () => {
      if (!user) return
      const key = messagesKey(user.id)
      const today = new Date().toISOString().slice(0, 10)
      const cached = queryClient.getQueryData<Message[]>(key) ?? []
      const sentToday = cached.filter((m) => m.role === 'user' && m.createdAt.slice(0, 10) === today).length
      posthog.capture('chat_message_sent', { message_count_today: sentToday })
      lastFailedContent.current = null
      void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
      void queryClient.invalidateQueries({ queryKey: key })
    },

    onError: (err, message, _context) => {
      if (!user) return

      if (err instanceof RateLimitError) {
        posthog.capture('chat_rate_limit_hit')
        queryClient.setQueryData<Message[]>(messagesKey(user.id), (old = []) => [
          ...old.filter((m) => !m.isOptimistic),
          RATE_LIMIT_MESSAGE,
        ])
        return
      }

      posthog.captureException(err, { operation: 'chat_message_send' })
      lastFailedContent.current = message
      queryClient.setQueryData<Message[]>(messagesKey(user.id), (old = []) =>
        old.map((m) => (m.isOptimistic ? { ...m, isOptimistic: false, isFailed: true } : m))
      )
    },
  })

  return {
    ...mutation,
    retryLastMessage: lastFailedContent.current != null
      ? () => mutation.mutate(lastFailedContent.current!)
      : undefined,
  }
}
