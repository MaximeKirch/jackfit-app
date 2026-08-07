import { View, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { GaugeRow } from './GaugeRow'
import { Spacing } from '@/shared/constants/tokens'
import type { ScoreBreakdown } from '../utils/scoring'

interface Props {
  breakdown: ScoreBreakdown
}

export const GaugesPanel = ({ breakdown }: Props) => {
  const { t } = useTranslation()
  return (
    <View style={styles.container}>
      <GaugeRow icon="moon"  label={t('home.gauges.sleep')}    value={breakdown.sleep} />
      <GaugeRow icon="run"   label={t('home.gauges.activity')} value={breakdown.activity} />
      <GaugeRow icon="heart" label={t('home.gauges.wellness')} value={breakdown.wellbeing} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width:           '100%',
    gap:             Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
})
