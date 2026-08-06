import { View, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { usePetStore } from '@/shared/stores/petStore'

interface Props {
  overrideMessage?: string | undefined
}

export const PetSpeechBubble = ({ overrideMessage }: Props) => {
  const { t } = useTranslation()
  const lastMessage = usePetStore((s) => s.lastMessage)
  const status = usePetStore((s) => s.status)
  const defaultMessage = t(`home.default_messages.${status.toLowerCase()}`)
  const message = overrideMessage ?? (lastMessage || defaultMessage)

  return (
    <View style={styles.bubble}>
      <Text style={styles.text}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  bubble: {
    marginTop: 24,
    marginHorizontal: 24,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8DDD0',
    backgroundColor: '#FFFFFF',
  },
  text: {
    fontSize: 16,
    lineHeight: 22,
    color: '#1A1A1A',
    fontWeight: '500',
    textAlign:'center'
  },
})
