import { useRef, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { Colors, Spacing, Typography } from '@/shared/constants/tokens'
import { useAuth } from '../hooks/useAuth'

interface OtpStepProps {
  email: string
  onBack: () => void
}

export const OtpStep = ({ email, onBack }: OtpStepProps) => {
  const [otp, setOtp] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const { verifyOtp, sendOtp } = useAuth()
  const inputRef = useRef<TextInput>(null)

  const handleVerify = async (code: string) => {
    if (code.length !== 6) return
    setIsVerifying(true)
    try {
      await verifyOtp(email, code)
    } catch {
      Alert.alert('Code invalide', 'Le code est incorrect ou a expiré. Demande-en un nouveau.')
      setOtp('')
      inputRef.current?.focus()
    } finally {
      setIsVerifying(false)
    }
  }

  const handleChangeText = (value: string) => {
    const numeric = value.replace(/[^0-9]/g, '').slice(0, 6)
    setOtp(numeric)
    if (numeric.length === 6) void handleVerify(numeric)
  }

  const handleResend = async () => {
    setIsResending(true)
    try {
      await sendOtp(email)
      Alert.alert('Code renvoyé', 'Vérifie ta boîte email.')
    } catch {
      Alert.alert('Erreur', 'Impossible de renvoyer le code.')
    } finally {
      setIsResending(false)
    }
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Retour</Text>
      </Pressable>

      <View style={styles.content}>
        <Text style={styles.title}>Vérifie ton email 📬</Text>
        <Text style={styles.subtitle}>
          {'Code envoyé à\n'}
          <Text style={styles.emailHighlight}>{email}</Text>
        </Text>

        <TextInput
          ref={inputRef}
          style={styles.otpInput}
          value={otp}
          onChangeText={handleChangeText}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          placeholder="000000"
          placeholderTextColor={Colors.stone}
          textAlign="center"
          editable={!isVerifying}
        />

        {isVerifying && <ActivityIndicator style={styles.loader} color={Colors.moss} />}

        <Pressable
          onPress={() => { void handleResend() }}
          disabled={isResending}
          style={styles.resendButton}
        >
          <Text style={styles.resendText}>
            {isResending ? 'Envoi en cours…' : 'Renvoyer le code'}
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  backButton: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
    alignSelf: 'flex-start',
  },
  backText: {
    fontFamily: 'Inter-Regular',
    fontSize: Typography.base,
    color: Colors.stone,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: Spacing.md,
  },
  title: {
    fontFamily: 'DMSerifDisplay-Regular',
    fontSize: Typography.xl,
    color: Colors.charcoal,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: Typography.sm,
    color: Colors.stone,
    textAlign: 'center',
    lineHeight: 22,
  },
  emailHighlight: {
    fontFamily: 'Inter-SemiBold',
    color: Colors.charcoal,
  },
  otpInput: {
    fontFamily: 'Inter-Regular',
    fontSize: 40,
    letterSpacing: 10,
    borderBottomWidth: 2,
    borderBottomColor: Colors.charcoal,
    paddingVertical: 12,
    marginTop: Spacing.md,
    color: Colors.charcoal,
  },
  loader: {
    marginTop: Spacing.sm,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginTop: Spacing.sm,
  },
  resendText: {
    fontFamily: 'Inter-Regular',
    fontSize: Typography.sm,
    color: Colors.stone,
    textDecorationLine: 'underline',
  },
})
