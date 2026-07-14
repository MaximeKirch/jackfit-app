import { View, Text, StyleSheet } from 'react-native'
import { Colors, Typography } from '@/shared/constants/tokens'
import type { Message } from '@/shared/types/chat.types'

interface ChatBubbleProps {
  message: Message
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const isUser = message.role === 'user'

  return (
    <View style={[styles.row, isUser ? styles.rowUser : styles.rowAI]}>
      <View
        style={[
          styles.bubble,
          isUser ? styles.bubbleUser : styles.bubbleAI,
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
})
