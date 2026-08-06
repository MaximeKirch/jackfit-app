import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { useTranslation } from 'react-i18next'
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/tokens'
import { useAuth } from '../hooks/useAuth'

interface EmailStepProps {
  onSuccess: (email: string) => void
}

export const EmailStep = ({ onSuccess }: EmailStepProps) => {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { sendOtp } = useAuth()

  const handleSubmit = async () => {
    const trimmed = email.trim().toLowerCase()
    if (!trimmed.includes('@')) {
      Alert.alert(t('auth.email.invalid_email_title'), t('auth.email.invalid_email_body'))
      return
    }
    setIsLoading(true)
    try {
      await sendOtp(trimmed)
      onSuccess(trimmed)
    } catch (error) {
      Alert.alert(t('common.error'), error instanceof Error ? error.message : t('common.generic_error'))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.avatarContainer}>
        <View style={styles.avatar}>
          <Text style={styles.avatarEmoji}>🐾</Text>
        </View>
        <Text style={styles.title}>{t('auth.email.welcome_title')}</Text>
        <Text style={styles.subtitle}>{t('auth.email.welcome_subtitle')}</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder={t('auth.email.placeholder')}
          placeholderTextColor={Colors.stone}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={() => { void handleSubmit() }}
          editable={!isLoading}
        />

        <Pressable
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={() => { void handleSubmit() }}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.buttonLabel}>{t('auth.email.send_button')}</Text>
          )}
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: 40,
  },
  avatarContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.sand,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  avatarEmoji: {
    fontSize: 40,
  },
  title: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: Typography.xxl,
    color: Colors.charcoal,
    letterSpacing: -0.5,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: Typography.base,
    color: Colors.stone,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    gap: Spacing.sm,
  },
  input: {
    height: 52,
    backgroundColor: Colors.sand,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    fontFamily: 'Inter-Regular',
    fontSize: Typography.base,
    color: Colors.charcoal,
  },
  button: {
    height: 52,
    backgroundColor: Colors.moss,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonDisabled: {
    backgroundColor: Colors.sand,
  },
  buttonLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Typography.base,
    color: Colors.white,
  },
})
