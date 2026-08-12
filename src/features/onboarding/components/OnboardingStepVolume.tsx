import { useState } from 'react'
import { View, Pressable, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing, Radius } from '@/shared/constants/tokens'
import { WEEKLY_VOLUME_BUCKETS, type WeeklyVolumeBucket } from '@/shared/constants/weeklyVolume'

export type VolumeChoice = WeeklyVolumeBucket | 'unknown'

interface Props {
  onNext:   (choice: VolumeChoice) => void
  onBack:   () => void
  initial?: VolumeChoice | null
  ctaLabel?: string
}

const CHOICES: readonly VolumeChoice[] = [...WEEKLY_VOLUME_BUCKETS, 'unknown']

export const OnboardingStepVolume = ({ onNext, onBack, initial, ctaLabel }: Props) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<VolumeChoice | null>(initial ?? null)
  const resolvedCta = ctaLabel ?? t('common.continue')

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text variant="body" size="base" color={Colors.stone}>{t('common.back')}</Text>
        </Pressable>
      </View>

      <Text variant="display" size="xxl" style={styles.title}>
        {t('onboarding.volume.title')}
      </Text>
      <Text variant="body" size="base" color={Colors.stone} style={styles.subtitle}>
        {t('onboarding.volume.subtitle')}
      </Text>

      <View style={styles.choices}>
        {CHOICES.map((choice) => {
          const isSelected = selected === choice
          const isSkip     = choice === 'unknown'

          return (
            <Pressable
              key={choice}
              onPress={() => setSelected(choice)}
              style={[
                styles.choiceCard,
                isSkip && styles.choiceCardSkip,
                isSelected && styles.choiceCardSelected,
              ]}
            >
              <Text
                variant="body"
                size="base"
                weight={isSelected ? 'semibold' : 'medium'}
                color={isSelected ? Colors.white : Colors.charcoal}
              >
                {t(`onboarding.volume.buckets.${choice}`)}
              </Text>
              {isSelected && <Text size="base" color={Colors.white}>✓</Text>}
            </Pressable>
          )
        })}
      </View>

      <Pressable
        style={[styles.button, !selected && styles.buttonDisabled]}
        onPress={() => selected && onNext(selected)}
        disabled={!selected}
      >
        <Text variant="body" size="base" weight="semibold" color={Colors.white}>
          {resolvedCta}
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: Spacing.xl },
  header:    { marginBottom: Spacing.lg },
  title: {
    color:        Colors.charcoal,
    marginBottom: Spacing.sm,
    lineHeight:   40,
  },
  subtitle: { marginBottom: Spacing.xl },
  choices:  { flex: 1, gap: Spacing.sm },
  choiceCard: {
    flexDirection:   'row',
    alignItems:      'center',
    justifyContent:  'space-between',
    backgroundColor: Colors.sand,
    borderRadius:    Radius.lg,
    padding:         Spacing.md,
  },
  choiceCardSkip:     { marginTop: Spacing.md },
  choiceCardSelected: { backgroundColor: Colors.moss },
  button: {
    backgroundColor: Colors.moss,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    alignItems:      'center',
    height:          52,
    justifyContent:  'center',
    marginTop:       Spacing.md,
  },
  buttonDisabled: { opacity: 0.4 },
})
