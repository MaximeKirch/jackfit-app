import { router } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { StyleSheet, View } from 'react-native'
import { AIConsentScreen } from '@/features/aiConsent/components/AIConsentScreen'
import { useAIConsent } from '@/features/aiConsent/hooks/useAIConsent'
import { Colors } from '@/shared/constants/tokens'

export default function AIConsentModal() {
  const { grantConsent, isGranting } = useAIConsent()
  const insets = useSafeAreaInsets()

  const handleAccept = async () => {
    await grantConsent('chat')
    router.back()
  }

  const handleDecline = () => {
    router.replace('/(tabs)')
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <AIConsentScreen
        onAccept={() => { void handleAccept() }}
        onDecline={handleDecline}
        isLoading={isGranting}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.linen,
  },
})
