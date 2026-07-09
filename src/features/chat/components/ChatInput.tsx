import { useState } from 'react'
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native'

interface ChatInputProps {
  onSend: (text: string) => void
  isLoading: boolean
  accentColor: string
}

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
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Parle à ton Jack Russell…"
        placeholderTextColor="#999"
        returnKeyType="send"
        onSubmitEditing={handleSend}
        editable={!isLoading}
        multiline={false}
      />
      <Pressable
        style={[styles.sendButton, { backgroundColor: canSend ? accentColor : '#E0E0E0' }]}
        onPress={handleSend}
        disabled={!canSend}
      >
        <Text style={styles.sendLabel}>→</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
    gap: 8,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: '#F5F5F5',
    borderRadius: 20,
    maxHeight: 44,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendLabel: {
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: '700',
  },
})
