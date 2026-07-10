import { useState } from 'react'
import { View, TextInput, Pressable, StyleSheet } from 'react-native'
import Svg, { Line } from 'react-native-svg'
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/tokens'

interface ChatInputProps {
  onSend: (text: string) => void
  isLoading: boolean
  accentColor: string
}

const SendIcon = ({ color }: { color: string }) => (
  <Svg width={18} height={18} viewBox="0 0 24 24" fill="none">
    <Line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="13" y1="6" x2="19" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
    <Line x1="13" y1="18" x2="19" y2="12" stroke={color} strokeWidth={2} strokeLinecap="round" />
  </Svg>
)

export const ChatInput = ({ onSend, isLoading, accentColor }: ChatInputProps) => {
  const [text, setText] = useState('')

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    onSend(trimmed)
    setText('')
  }

  const canSend = text.trim().length > 0 && !isLoading

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Dis quelque chose…"
          placeholderTextColor={Colors.stone}
          returnKeyType="send"
          onSubmitEditing={handleSend}
          editable={!isLoading}
          multiline={false}
        />
        <Pressable
          style={[styles.sendButton, { backgroundColor: canSend ? accentColor : Colors.sand }]}
          onPress={handleSend}
          disabled={!canSend}
        >
          <SendIcon color={canSend ? Colors.white : Colors.stone} />
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.linen,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.sand,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.sand,
    borderRadius: Radius.xl,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: Typography.base,
    color: Colors.charcoal,
    paddingVertical: 10,
    maxHeight: 44,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
