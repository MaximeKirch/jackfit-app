import { View, StyleSheet } from 'react-native'
import { Text } from '@/shared/components/Text'
import { usePetStore } from '@/shared/stores/petStore'
import { nextStage, stageInfo } from '@/features/pet/utils/stages'
import { Colors, Spacing } from '@/shared/constants/tokens'
import { AnimatedGaugeRow } from './AnimatedGaugeRow'
import { StageProgressBar } from './StageProgressBar'

interface Props {
  isOpen: boolean
}

const STAGGER_MS = 70

export const InfoSheetContent = ({ isOpen }: Props) => {
  const breakdown    = usePetStore((s) => s.breakdown)
  const totalXp      = usePetStore((s) => s.totalXp)
  const currentStage = usePetStore((s) => s.currentStage)

  if (!breakdown) {
    return (
      <View style={styles.container}>
        <Text variant="body" color={Colors.stone}>
          Pas encore assez de données cette semaine.
        </Text>
      </View>
    )
  }

  const stage = stageInfo(currentStage)
  const next  = nextStage(currentStage)
  const xpToNext = next ? Math.max(next.minXp - totalXp, 0) : 0
  const stageProgress = next
    ? Math.min((totalXp - stage.minXp) / (next.minXp - stage.minXp), 1)
    : 1

  const rows: Array<{ label: string; value: number }> = [
    { label: 'Activité',  value: breakdown.activity },
    { label: 'Sommeil',   value: breakdown.sleep },
    { label: 'Bien-être', value: breakdown.wellbeing },
  ]

  return (
    <View style={styles.container}>
      <Text variant="display" size="lg" style={styles.title}>
        Cette semaine
      </Text>

      <View style={styles.rows}>
        {rows.map((row, i) => (
          <AnimatedGaugeRow
            key={row.label}
            label={row.label}
            value={row.value}
            delay={i * STAGGER_MS}
            isOpen={isOpen}
          />
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text variant="body" size="sm" color={Colors.stone}>Total</Text>
        <Text variant="mono" size="md" color={Colors.charcoal}>
          {breakdown.total}/100
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.stageBlock}>
        <Text variant="body" size="sm" color={Colors.stone}>Palier</Text>
        <Text variant="body" size="md" color={Colors.charcoal} style={styles.stageLine}>
          {stage.label}
          {next ? ` · encore ${xpToNext} XP avant ${next.label}` : ' · palier maximum atteint'}
        </Text>
        <View style={styles.stageBarWrap}>
          <StageProgressBar
            progress={stageProgress}
            delay={rows.length * STAGGER_MS}
            isOpen={isOpen}
          />
        </View>
        <Text variant="mono" size="xs" color={Colors.stone} style={styles.xpCurrent}>
          {totalXp} XP
        </Text>
      </View>

      <View style={styles.divider} />

      <Text variant="body" size="sm" color={Colors.stone} style={styles.explainer}>
        Ton score dépend de ta régularité (pas juste du volume) et de ta récupération.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingTop:        Spacing.sm,
    paddingBottom:     Spacing.xl,
    gap:               Spacing.lg,
  },
  title: {
    color: Colors.charcoal,
  },
  rows: {
    gap: Spacing.md,
  },
  totalRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'baseline',
    paddingTop:     Spacing.xs,
  },
  divider: {
    height:          StyleSheet.hairlineWidth,
    backgroundColor: Colors.stone,
    opacity:         0.3,
  },
  stageBlock: {
    gap: Spacing.xs,
  },
  stageLine: {
    marginTop: 2,
  },
  stageBarWrap: {
    marginTop: Spacing.xs,
  },
  xpCurrent: {
    marginTop: 4,
    textAlign: 'right',
  },
  explainer: {
    lineHeight: 20,
  },
})
