import { View, Text, StyleSheet } from 'react-native'
import { Card } from '@/shared/components/Card'
import { Skeleton } from '@/shared/components/Skeleton'
import type { ActivityStats } from '../hooks/useStats'

const WORKOUT_LABELS: Record<string, string> = {
  running: 'Course à pied',
  cycling: 'Vélo',
  swimming: 'Natation',
  strength: 'Musculation',
  default: 'Autre',
}

const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h${m.toString().padStart(2, '0')}`
}

interface ActivityCardProps {
  stats: ActivityStats
  accentColor: string
}

export const ActivityCard = ({ stats, accentColor }: ActivityCardProps) => {
  const targetMinutes = stats.targetHours * 60
  const progress = Math.min(stats.totalMinutes / targetMinutes, 1)

  return (
    <Card>
      <Text style={styles.label}>ACTIVITÉ</Text>
      <Text style={[styles.mainValue, { color: accentColor }]}>
        {formatDuration(stats.totalMinutes)}
      </Text>
      <Text style={styles.subLabel}>/ objectif {formatDuration(targetMinutes)}</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${Math.round(progress * 100)}%` as `${number}%`, backgroundColor: accentColor }]} />
      </View>

      <View style={styles.row}>
        <StatChip label={`${stats.workoutCount} séance${stats.workoutCount > 1 ? 's' : ''}`} />
        {stats.topType !== null && (
          <StatChip label={WORKOUT_LABELS[stats.topType] ?? stats.topType} />
        )}
        <StatChip label={`${stats.totalCalories} kcal`} />
      </View>
    </Card>
  )
}

const StatChip = ({ label }: { label: string }) => (
  <View style={styles.chip}>
    <Text style={styles.chipText}>{label}</Text>
  </View>
)

export const ActivityCardSkeleton = () => (
  <Card>
    <Skeleton width={80} height={12} borderRadius={6} />
    <View style={{ height: 10 }} />
    <Skeleton width={120} height={36} borderRadius={8} />
    <View style={{ height: 8 }} />
    <Skeleton width="100%" height={6} borderRadius={3} />
    <View style={{ height: 12 }} />
    <View style={styles.row}>
      <Skeleton width={80} height={28} borderRadius={14} />
      <Skeleton width={110} height={28} borderRadius={14} />
      <Skeleton width={80} height={28} borderRadius={14} />
    </View>
  </Card>
)

const styles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9E9E9E',
    letterSpacing: 1,
    marginBottom: 4,
  },
  mainValue: {
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 48,
  },
  subLabel: {
    fontSize: 13,
    color: '#9E9E9E',
    marginBottom: 12,
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#F0F0F0',
    borderRadius: 3,
    marginBottom: 14,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F5F5F5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  chipText: {
    fontSize: 13,
    color: '#424242',
    fontWeight: '500',
  },
})
