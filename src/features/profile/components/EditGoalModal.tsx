import { Modal, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { OnboardingStep4Goal, type GoalValue } from '@/features/onboarding/components/OnboardingStep4Goal'
import { Colors } from '@/shared/constants/tokens'

interface Props {
  visible:   boolean
  current:   GoalValue
  onSave:    (goal: GoalValue) => Promise<void>
  onClose:   () => void
}

export const EditGoalModal = ({ visible, current, onSave, onClose }: Props) => {
  const { t } = useTranslation()
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={styles.container}>
        <OnboardingStep4Goal
          initial={current}
          onNext={async (goal) => {
            await onSave(goal)
            onClose()
          }}
          onBack={onClose}
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
