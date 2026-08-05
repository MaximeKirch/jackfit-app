import { useState } from 'react'
import { View, Pressable, StyleSheet, ScrollView } from 'react-native'
import { Text } from '@/shared/components/Text'
import { Colors, Spacing, Radius } from '@/shared/constants/tokens'
import { SPORTS, type SportId } from '@/shared/constants/sports'

interface Props {
  onNext: (sports: SportId[]) => void
  onBack: () => void
  initialSelected?: SportId[]
}

export const OnboardingStep2Sports = ({ onNext, onBack, initialSelected }: Props) => {
  const [selected, setSelected] = useState<SportId[]>(initialSelected ?? [])

  const MAX_SPORTS = 3

  const toggle = (id: SportId) => {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((s) => s !== id)
      if (prev.length >= MAX_SPORTS) return prev
      return [...prev, id]
    })
  }

  const isValid = selected.length >= 1

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Text variant="body" size="base" color={Colors.stone}>← Retour</Text>
        </Pressable>
      </View>

      <Text variant="display" size="xxl" style={styles.title}>
        Tes sports 🏅
      </Text>
      <Text variant="body" size="base" color={Colors.stone} style={styles.subtitle}>
        Choisis jusqu'à {MAX_SPORTS} sports
        {selected.length > 0 && ` · ${selected.length}/${MAX_SPORTS}`}
      </Text>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {SPORTS.map((sport) => {
          const isSelected = selected.includes(sport.id)
          const isDisabled = !isSelected && selected.length >= MAX_SPORTS

          return (
            <Pressable
              key={sport.id}
              onPress={() => toggle(sport.id)}
              disabled={isDisabled}
              style={[
                styles.chip,
                isSelected && styles.chipSelected,
                isDisabled && styles.chipDisabled,
              ]}
            >
              <Text size="lg">{sport.emoji}</Text>
              <Text
                variant="body"
                size="sm"
                weight={isSelected ? 'semibold' : 'regular'}
                color={isSelected ? Colors.white : Colors.charcoal}
              >
                {sport.label}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      <Pressable
        style={[styles.button, !isValid && styles.buttonDisabled]}
        onPress={() => isValid && onNext(selected)}
        disabled={!isValid}
      >
        <Text variant="body" size="base" weight="semibold" color={Colors.white}>
          Continuer →
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingVertical: Spacing.xl },
  header:    { marginBottom: Spacing.lg },
  title:     { color: Colors.charcoal, marginBottom: Spacing.sm },
  subtitle:  { marginBottom: Spacing.xl },
  scroll:    { flex: 1 },
  grid: {
    flexDirection: 'row',
    flexWrap:      'wrap',
    gap:           Spacing.sm,
    paddingBottom: Spacing.lg,
  },
  chip: {
    flexDirection:    'row',
    alignItems:       'center',
    gap:              Spacing.xs,
    backgroundColor:  Colors.sand,
    borderRadius:     Radius.full,
    paddingVertical:  Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  chipSelected:  { backgroundColor: Colors.moss },
  chipDisabled:  { opacity: 0.35 },
  button: {
    backgroundColor: Colors.moss,
    borderRadius:    Radius.md,
    padding:         Spacing.md,
    alignItems:      'center',
    marginTop:       Spacing.md,
  },
  buttonDisabled: { opacity: 0.4 },
})
