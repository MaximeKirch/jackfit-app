import { View, StyleSheet, Pressable } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing } from '@/shared/constants/tokens'
import { AIConsentScreen } from '@/features/aiConsent/components/AIConsentScreen'

interface Props {
  onAccept:  () => void
  onDecline: () => void
  onBack:    () => void
  isLoading: boolean
}

export const OnboardingStep4Consent = ({ onAccept, onDecline, onBack, isLoading }: Props) => {
  const { t } = useTranslation()
  return (
  <View style={styles.container}>
    <View style={styles.header}>
      <Pressable onPress={onBack} disabled={isLoading}>
        <Text variant="body" size="base" color={Colors.stone}>{t('common.back')}</Text>
      </Pressable>
    </View>

    <AIConsentScreen
      onAccept={onAccept}
      onDecline={onDecline}
      isLoading={isLoading}
    />
  </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    marginHorizontal: -Spacing.lg,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop:        Spacing.lg,
  },
})
