import { useState } from 'react'
import { Modal, View, Pressable, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import Slider from '@react-native-community/slider'
import * as Haptics from 'expo-haptics'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing, Radius } from '@/shared/constants/tokens'

const MIN_HOURS = 0
const MAX_HOURS = 20
const STEP      = 0.5
const DEFAULT   = 5

interface Props {
  visible:   boolean
  current:   number | null
  onSave:    (hours: number) => Promise<void>
  onClose:   () => void
  isLoading: boolean
}

export const EditWeeklyHoursModal = ({ visible, current, onSave, onClose, isLoading }: Props) => {
  const { t } = useTranslation()
  const [hours, setHours] = useState<number>(current ?? DEFAULT)

  const handleSave = async () => {
    await onSave(hours)
    onClose()
  }

  const handleSliderChange = (next: number) => {
    if (next !== hours) void Haptics.selectionAsync()
    setHours(next)
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onShow={() => setHours(current ?? DEFAULT)}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={onClose} disabled={isLoading}>
            <Text variant="body" size="base" color={Colors.stone}>{t('common.cancel')}</Text>
          </Pressable>
          <Text variant="body" size="base" weight="semibold">{t('profile.weekly_hours_edit_title')}</Text>
          <Pressable onPress={handleSave} disabled={isLoading}>
            <Text variant="body" size="base" weight="semibold" color={Colors.moss}>
              {isLoading ? '...' : t('common.save')}
            </Text>
          </Pressable>
        </View>

        <Text variant="body" size="base" color={Colors.stone} style={styles.subtitle}>
          {t('profile.weekly_hours_edit_subtitle')}
        </Text>

        <View style={styles.valueBox}>
          <Text variant="display" size="xxxl" color={Colors.charcoal}>
            {hours.toFixed(1).replace(/\.0$/, '')}
          </Text>
          <Text variant="body" size="lg" color={Colors.stone} style={styles.unit}>
            {t('profile.weekly_hours_unit')}
          </Text>
        </View>

        <Slider
          style={styles.slider}
          minimumValue={MIN_HOURS}
          maximumValue={MAX_HOURS}
          step={STEP}
          value={hours}
          onValueChange={handleSliderChange}
          onSlidingComplete={() => { void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light) }}
          minimumTrackTintColor={Colors.moss}
          maximumTrackTintColor={Colors.sand}
          thumbTintColor={Colors.moss}
        />

        <View style={styles.scaleRow}>
          <Text variant="body" size="sm" color={Colors.stone}>{MIN_HOURS}h</Text>
          <Text variant="body" size="sm" color={Colors.stone}>{MAX_HOURS}h</Text>
        </View>
      </SafeAreaView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex:            1,
    backgroundColor: Colors.linen,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   Spacing.xl,
    paddingTop:     Spacing.md,
  },
  subtitle: { marginBottom: Spacing.xl },
  valueBox: {
    alignItems:      'center',
    justifyContent:  'center',
    backgroundColor: Colors.sand,
    borderRadius:    Radius.lg,
    paddingVertical: Spacing.xl,
    marginBottom:    Spacing.xl,
    gap:             Spacing.xs,
  },
  unit:   { letterSpacing: -0.2 },
  slider: { width: '100%', height: 40 },
  scaleRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    marginTop:      Spacing.xs,
  },
})
