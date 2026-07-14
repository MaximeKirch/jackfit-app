import { View, StyleSheet } from 'react-native'
import { GaugeRow } from './GaugeRow'
import { Spacing } from '@/shared/constants/tokens'
import type { ScoreBreakdown } from '../utils/scoring'

interface Props {
  breakdown: ScoreBreakdown
}

export const GaugesPanel = ({ breakdown }: Props) => (
  <View style={styles.container}>
    <GaugeRow emoji="💤" label="Sommeil"   value={breakdown.sleep} />
    <GaugeRow emoji="🏃" label="Activité"  value={breakdown.activity} />
    <GaugeRow emoji="❤️" label="Bien-être" value={breakdown.wellbeing} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    width:           '100%',
    gap:             Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
})
