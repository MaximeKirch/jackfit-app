import { Modal, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { OnboardingStep2Sports } from '@/features/onboarding/components/OnboardingStep2Sports'
import { Colors } from '@/shared/constants/tokens'
import type { SportId } from '@/shared/constants/sports'

interface Props {
  visible:   boolean
  current:   SportId[]
  onSave:    (sports: SportId[]) => Promise<void>
  onClose:   () => void
  isLoading: boolean
}

export const EditSportsModal = ({ visible, current, onSave, onClose }: Props) => (
  <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
    <SafeAreaView style={styles.container}>
      <OnboardingStep2Sports
        initialSelected={current}
        onNext={async (sports) => {
          await onSave(sports)
          onClose()
        }}
        onBack={onClose}
      />
    </SafeAreaView>
  </Modal>
)

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.linen,
    paddingHorizontal: 24,
  },
})
