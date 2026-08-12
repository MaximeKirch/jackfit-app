import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const breakdown    = usePetStore((s) => s.breakdown)
  const totalXp      = usePetStore((s) => s.totalXp)
  const currentStage = usePetStore((s) => s.currentStage)

  if (!breakdown) {
    return (
      <View style={styles.container}>
        <Text variant="body" color={Colors.stone}>
          {t('home.info_sheet.not_enough_data')}
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

  const rows = [
    { key: 'activity', label: t('home.gauges.activity'), value: breakdown.activity,  disabled: false },
    { key: 'sleep',    label: t('home.gauges.sleep'),    value: breakdown.sleep,     disabled: breakdown.sleepExcluded },
    { key: 'wellness', label: t('home.gauges.wellness'), value: breakdown.wellbeing, disabled: false },
  ]

  return (
    <View style={styles.container}>
      <Text variant="display" size="lg" style={styles.title}>
        {t('home.info_sheet.this_week')}
      </Text>

      <View style={styles.rows}>
        {rows.map((row, i) => (
          <AnimatedGaugeRow
            key={row.key}
            label={row.label}
            value={row.value}
            delay={i * STAGGER_MS}
            isOpen={isOpen}
            disabled={row.disabled}
          />
        ))}
      </View>

      <View style={styles.totalRow}>
        <Text variant="body" size="sm" color={Colors.stone}>{t('home.info_sheet.total')}</Text>
        <Text variant="mono" size="md" color={Colors.charcoal}>
          {breakdown.total}/100
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.stageBlock}>
        <Text variant="body" size="sm" color={Colors.stone}>{t('home.info_sheet.stage')}</Text>
        <Text variant="body" size="md" color={Colors.charcoal} style={styles.stageLine}>
          {t(`stages.${currentStage}`)}
          {next
            ? t('home.info_sheet.stage_progress', { xp: xpToNext, next: t(`stages.${next.name}`) })
            : t('home.info_sheet.stage_max')}
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
        {t('home.info_sheet.explanation')}
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
