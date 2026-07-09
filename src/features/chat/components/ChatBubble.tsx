import { View, Text, StyleSheet } from 'react-native'
import type { Message } from '@/shared/types/chat.types'

interface ChatBubbleProps {
  message: Message
  accentColor: string
}

export const ChatBubble = ({ message, accentColor }: ChatBubbleProps) => {
  const isUser = message.role === 'user'

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}>
      <View
        style={[
          styles.bubble,
          isUser
            ? [styles.bubbleUser, { backgroundColor: accentColor }]
            : [styles.bubbleAI, { borderColor: accentColor }],
          message.isOptimistic === true && styles.optimistic,
        ]}
      >
        <Text style={[styles.text, isUser ? styles.textUser : styles.textAI]}>
          {message.content}
        </Text>
      </View>
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
    borderBottomRightRadius: 4,
  },
  bubbleAI: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderBottomLeftRadius: 4,
  },
  optimistic: {
    opacity: 0.7,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
  textUser: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  textAI: {
    color: '#1A1A1A',
  },
})
