import { useState } from 'react'
import { View, TextInput, Pressable, StyleSheet } from 'react-native'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing, Radius, Typography } from '@/shared/constants/tokens'

interface Props {
  onNext: (firstName: string) => void
}

export const OnboardingStep1Name = ({ onNext }: Props) => {
  const [name, setName] = useState('')

  const isValid = name.trim().length >= 2

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text variant="display" size="xxl" style={styles.title}>
          Bonjour 👋
        </Text>
        <Text variant="body" size="base" color={Colors.stone} style={styles.subtitle}>
          Comment tu t'appelles ?
        </Text>

        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ton prénom"
          placeholderTextColor={Colors.stone}
          autoFocus
          autoCapitalize="words"
          returnKeyType="done"
          onSubmitEditing={() => isValid && onNext(name)}
        />
      </View>

      <Pressable
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={() => isValid && onNext(name)}
        disabled={!isValid}
      >
        <Text variant="body" size="base" weight="semibold" color={Colors.white}>
          Continuer →
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'space-between', paddingVertical: Spacing.xl },
  content:   { flex: 1, justifyContent: 'center', gap: Spacing.lg },
  title:     { color: Colors.charcoal },
  subtitle:  { lineHeight: 22 },
  input: {
    backgroundColor: Colors.sand,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    fontSize:        Typography.xl,
    fontFamily:      'Inter-Medium',
    color:           Colors.charcoal,
    marginTop:       Spacing.md,
    letterSpacing:   -0.2,
  },
  button: {
    backgroundColor: Colors.moss,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    alignItems:      'center',
  },
  buttonDisabled: { opacity: 0.4 },
})
