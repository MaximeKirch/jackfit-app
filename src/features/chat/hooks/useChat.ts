import { useRef } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { sendMessage, fetchMessages } from '../api/chatApi'
import { useAuthStore } from '@/shared/stores/authStore'
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

export const useChat = (healthData: HealthSummary | null) => {
  const queryClient = useQueryClient()
  const user = useAuthStore((state) => state.user)
  const lastFailedContent = useRef<string | null>(null)

  const mutation = useMutation({
    mutationFn: (message: string) => {
      if (!healthData) throw new Error('Health data not available')
      if (!user) throw new Error('Not authenticated')
      return sendMessage(user.id, message, healthData)
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
      lastFailedContent.current = null
      void queryClient.invalidateQueries({ queryKey: messagesKey(user.id) })
    },

    onError: (_err, message, _context) => {
      if (!user) return
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
