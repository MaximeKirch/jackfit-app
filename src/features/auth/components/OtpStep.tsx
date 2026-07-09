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
      // onAuthStateChange dans AuthGuard prend le relais → redirect automatique
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
    if (numeric.length === 6) {
      void handleVerify(numeric)
    }
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
          placeholderTextColor="#CCCCCC"
          textAlign="center"
          editable={!isVerifying}
        />

        {isVerifying && <ActivityIndicator style={styles.loader} color="#1A1A1A" />}

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
    paddingHorizontal: 24,
  },
  backButton: {
    paddingTop: 16,
    paddingBottom: 8,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 16,
    color: '#9E9E9E',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: '#9E9E9E',
    textAlign: 'center',
    lineHeight: 22,
  },
  emailHighlight: {
    fontWeight: '600',
    color: '#1A1A1A',
  },
  otpInput: {
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#1A1A1A',
    paddingVertical: 12,
    marginTop: 16,
    color: '#1A1A1A',
  },
  loader: {
    marginTop: 8,
  },
  resendButton: {
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  resendText: {
    fontSize: 15,
    color: '#9E9E9E',
    textDecorationLine: 'underline',
  },
})
