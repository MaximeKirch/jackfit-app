import { View, StyleSheet } from 'react-native'
import { GaugeRow } from './GaugeRow'
import { Spacing } from '@/shared/constants/tokens'
import type { ScoreBreakdown } from '../utils/scoring'

interface Props {
  breakdown: ScoreBreakdown
}

export const GaugesPanel = ({ breakdown }: Props) => (
  <View style={styles.container}>
    <GaugeRow icon="moon" label="Sommeil"   value={breakdown.sleep} />
    <GaugeRow icon="run"  label="Activité"  value={breakdown.activity} />
    <GaugeRow icon="heart" label="Bien-être" value={breakdown.wellbeing} />
  </View>
)

const styles = StyleSheet.create({
  container: {
    width:           '100%',
    gap:             Spacing.md,
    paddingHorizontal: Spacing.lg,
  },
})
