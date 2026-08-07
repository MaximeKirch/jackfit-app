import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors, Typography } from '@/shared/constants/tokens'
import type { Message } from '@/shared/types/chat.types'

interface ChatBubbleProps {
  message: Message
  onRetry?: (() => void) | undefined
}

export const ChatBubble = ({ message, onRetry }: ChatBubbleProps) => {
  const { t } = useTranslation()
  const isUser = message.role === 'user'

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAI,
          message.isOptimistic === true && styles.optimistic,
          message.isFailed === true && styles.failed,
        ]}
      >
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAI]}>
          {message.content}
        </Text>
      </View>
      {message.isFailed === true && onRetry && (
        <Pressable onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>{t('chat.retry_button')}</Text>
        </Pressable>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 16,
    marginVertical: 4,
  },
  rowUser: {
    alignItems: 'flex-end',
  },
  rowAI: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  bubbleUser: {
    backgroundColor: Colors.moss,
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 4,
  },
  optimistic: {
    opacity: 0.7,
  },
  failed: {
    opacity: 0.45,
  },
  text: {
    fontFamily: 'Inter-Regular',
    fontSize: Typography.base,
    lineHeight: 21,
  },
  textUser: {
    fontFamily: 'Inter-Medium',
    color: Colors.white,
  },
  textAI: {
    color: Colors.charcoal,
  },
  retryButton: {
    marginTop: 4,
  },
  retryText: {
    fontFamily: 'Inter-Regular',
    fontSize: Typography.sm,
    color: Colors.pet.TIRED,
  },
})
