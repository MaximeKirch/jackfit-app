import { useState } from 'react'
import { View, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing, Radius } from '@/shared/constants/tokens'
import { ATHLETE_PROFILES, type AthleteProfileKey } from '@/shared/constants/athleteProfiles'

interface Props {
  firstName?:      string
  onNext:          (profile: AthleteProfileKey) => void
  onBack:          () => void
  isLoading:       boolean
  initialSelected?: AthleteProfileKey | null
  ctaLabel?:       string
}

export const OnboardingStep3Profile = ({ firstName, onNext, onBack, isLoading, initialSelected, ctaLabel }: Props) => {
  const { t } = useTranslation()
  const [selected, setSelected] = useState<AthleteProfileKey | null>(initialSelected ?? null)
  const resolvedCta = ctaLabel ?? t('onboarding.consent_cta')

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text variant="body" size="base" color={Colors.stone}>{t('common.back')}</Text>
        </Pressable>
      </View>

      <Text variant="display" size="xxl" style={styles.title}>
        {firstName ? t('onboarding.profile.title_with_name', { name: firstName }) : t('onboarding.profile.title')}
      </Text>
      <Text variant="body" size="base" color={Colors.stone} style={styles.subtitle}>
        {t('onboarding.profile.subtitle')}
      </Text>

      <View style={styles.profiles}>
        {(Object.entries(ATHLETE_PROFILES) as [AthleteProfileKey, (typeof ATHLETE_PROFILES)[AthleteProfileKey]][]).map(
          ([key, profile]) => {
            const isSelected = selected === key

            return (
              <Pressable
                key={key}
                onPress={() => setSelected(key)}
                style={[styles.profileCard, isSelected && styles.profileCardSelected]}
              >
                <Text size="xl">{profile.emoji}</Text>
                <View style={styles.profileText}>
                  <Text
                    variant="body"
                    size="base"
                    weight={isSelected ? 'semibold' : 'medium'}
                    color={isSelected ? Colors.white : Colors.charcoal}
                  >
                    {t(`athlete_profiles.${key}.label`)}
                  </Text>
                  <Text
                    variant="body"
                    size="sm"
                    color={isSelected ? Colors.white : Colors.stone}
                  >
                    {t(`athlete_profiles.${key}.description`)}
                  </Text>
                </View>
                {isSelected && (
                  <Text size="base" color={Colors.white}>✓</Text>
                )}
              </Pressable>
            )
          }
        )}
      </View>

      <Pressable
        style={[styles.button, (!selected || isLoading) && styles.buttonDisabled]}
        onPress={() => selected && onNext(selected)}
        disabled={!selected || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={Colors.white} />
        ) : (
          <Text variant="body" size="base" weight="semibold" color={Colors.white}>
            {resolvedCta}
          </Text>
        )}
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
  subtitle:    { marginBottom: Spacing.xl },
  profiles:    { flex: 1, gap: Spacing.sm },
  profileCard: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             Spacing.md,
    backgroundColor: Colors.sand,
    borderRadius:    Radius.lg,
    padding:         Spacing.md,
  },
  profileCardSelected: { backgroundColor: Colors.moss },
  profileText:         { flex: 1 },
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
