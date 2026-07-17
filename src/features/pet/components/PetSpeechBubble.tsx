import { View, Text, StyleSheet } from 'react-native'
import { usePetStore } from '@/shared/stores/petStore'
import type { PetStatus } from '@/shared/types/pet.types'

const DEFAULT_MESSAGES: Record<PetStatus, string> = {
  NEW:         "On ne se connaît pas encore — bouge un peu et je vais commencer à comprendre comment tu vas.",
  PEAK:        'Tu cartonnes cette semaine. Continue comme ça.',
  GOOD:        "Bonne semaine dans l'ensemble. Mais tu peux faire mieux.",
  TIRED:       'Tu tires la langue là. Dors un peu plus.',
  LAZY:        "Sérieusement ? C'est tout ce que t'as fait cette semaine ?",
  OVERREACHED: 'Stop. Tu te détruis. Récupère maintenant.',
}

interface Props {
  overrideMessage?: string | undefined
}

export const PetSpeechBubble = ({ overrideMessage }: Props) => {
  const lastMessage = usePetStore((s) => s.lastMessage)
  const status = usePetStore((s) => s.status)
  const message = overrideMessage ?? (lastMessage || DEFAULT_MESSAGES[status])

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
