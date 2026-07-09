import { useState } from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { EmailStep } from './EmailStep'
import { OtpStep } from './OtpStep'

type Step = 'email' | 'otp'

export const AuthScreen = () => {
  const [step, setStep] = useState<Step>('email')
  const [email, setEmail] = useState('')

  const handleEmailSuccess = (submittedEmail: string) => {
    setEmail(submittedEmail)
    setStep('otp')
  }

  return (
    <SafeAreaView style={styles.container}>
      {step === 'email' ? (
        <EmailStep onSuccess={handleEmailSuccess} />
      ) : (
        <OtpStep email={email} onBack={() => setStep('email')} />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
})
