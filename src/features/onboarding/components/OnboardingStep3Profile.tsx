import { useState } from 'react'
import { View, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
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

export const OnboardingStep3Profile = ({ firstName, onNext, onBack, isLoading, initialSelected, ctaLabel = 'Rencontrer Uma 🐾' }: Props) => {
  const [selected, setSelected] = useState<AthleteProfileKey | null>(initialSelected ?? null)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text variant="body" size="base" color={Colors.stone}>← Retour</Text>
        </Pressable>
      </View>

      <Text variant="display" size="xxl" style={styles.title}>
        {firstName ? `${firstName}, comment` : 'Comment'}{'\n'}tu t'entraînes ?
      </Text>
      <Text variant="body" size="base" color={Colors.stone} style={styles.subtitle}>
        Uma adaptera ses attentes à ton rythme.
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
                    {profile.label}
                  </Text>
                  <Text
                    variant="body"
                    size="sm"
                    color={isSelected ? Colors.white : Colors.stone}
                  >
                    {profile.description}
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
            {ctaLabel}
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
