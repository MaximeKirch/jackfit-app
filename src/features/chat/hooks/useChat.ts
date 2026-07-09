import { useMutation, useQueryClient } from '@tanstack/react-query'
import { sendMessage } from '../api/chatApi'
import type { HealthSummary } from '@/shared/types/health.types'
import type { Message } from '@/shared/types/chat.types'

export const MESSAGES_KEY = ['messages'] as const

export const useChat = (healthData: HealthSummary | null) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (message: string) => {
      if (!healthData) throw new Error('Health data not available')
      return sendMessage(message, healthData)
    },

    onMutate: async (message: string) => {
      await queryClient.cancelQueries({ queryKey: MESSAGES_KEY })
      const previousMessages = queryClient.getQueryData<Message[]>(MESSAGES_KEY)

      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`,
        role: 'user',
        content: message,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      }

      queryClient.setQueryData<Message[]>(MESSAGES_KEY, (old = []) => [...old, optimisticMessage])

      return { previousMessages }
    },

    onSuccess: (aiResponse: string, userMessage: string) => {
      const now = Date.now()
      queryClient.setQueryData<Message[]>(MESSAGES_KEY, (old = []) => [
        ...old.filter((m) => !m.isOptimistic),
        {
          id: `user-${now}`,
          role: 'user',
          content: userMessage,
          createdAt: new Date(now).toISOString(),
        },
        {
          id: `ai-${now + 1}`,
          role: 'assistant',
          content: aiResponse,
          createdAt: new Date(now + 1).toISOString(),
        },
      ])
    },

    onError: (_err, _message, context) => {
      queryClient.setQueryData(MESSAGES_KEY, context?.previousMessages)
    },
  })
}
