import { Modal, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { OnboardingStep3Profile } from '@/features/onboarding/components/OnboardingStep3Profile'
import { Colors } from '@/shared/constants/tokens'
import type { AthleteProfileKey } from '@/shared/constants/athleteProfiles'

interface Props {
  visible:   boolean
  current:   AthleteProfileKey | null
  onSave:    (profile: AthleteProfileKey) => Promise<void>
  onClose:   () => void
  isLoading: boolean
}

export const EditAthleteModal = ({ visible, current, onSave, onClose, isLoading }: Props) => {
  const { t } = useTranslation()
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <OnboardingStep3Profile
          initialSelected={current}
          onNext={async (profile) => {
            await onSave(profile)
            onClose()
          }}
          onBack={onClose}
          isLoading={isLoading}
          ctaLabel={t('common.validate')}
        />
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.linen,
    paddingHorizontal: 24,
  },
})
