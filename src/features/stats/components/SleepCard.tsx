import { View, Text, StyleSheet } from 'react-native'
import { Card } from '@/shared/components/Card'
import { Skeleton } from '@/shared/components/Skeleton'
import type { SleepStats } from '../hooks/useStats'

const qualityColor = (avgHours: number, targetHours: number): string => {
  const ratio = avgHours / targetHours
  if (ratio >= 0.93) return '#00C853'
  if (ratio >= 0.81) return '#69F0AE'
  if (ratio >= 0.625) return '#FF6D00'
  return '#FF1744'
}

const qualityLabel = (avgHours: number, targetHours: number): string => {
  const ratio = avgHours / targetHours
  if (ratio >= 0.93) return 'Excellent'
  if (ratio >= 0.81) return 'Correct'
  if (ratio >= 0.625) return 'Insuffisant'
  return 'Mauvais'
}

interface SleepCardProps {
  stats: SleepStats
}

export const SleepCard = ({ stats }: SleepCardProps) => {
  const color = stats.nightCount > 0 ? qualityColor(stats.avgHours, stats.targetHours) : '#9E9E9E'
  const label = stats.nightCount > 0 ? qualityLabel(stats.avgHours, stats.targetHours) : '—'

  return (
    <Card>
      <Text style={styles.label}>SOMMEIL</Text>
      <View style={styles.mainRow}>
        <Text style={[styles.mainValue, { color }]}>
          {stats.nightCount > 0 ? `${stats.avgHours}h` : '—'}
        </Text>
        <View style={[styles.badge, { backgroundColor: color }]}>
          <Text style={styles.badgeText}>{label}</Text>
        </View>
      </View>
      <Text style={styles.subLabel}>
        {stats.nightCount > 0
          ? `moyenne sur ${stats.nightCount} nuit${stats.nightCount > 1 ? 's' : ''} · objectif ${stats.targetHours}h`
          : 'Aucune donnée cette semaine'}
      </Text>
    </Card>
  )
}

export const SleepCardSkeleton = () => (
  <Card>
    <Skeleton width={70} height={12} borderRadius={6} />
    <View style={{ height: 10 }} />
    <View style={styles.mainRow}>
      <Skeleton width={90} height={40} borderRadius={8} />
      <Skeleton width={80} height={26} borderRadius={13} />
    </View>
    <View style={{ height: 8 }} />
    <Skeleton width="70%" height={12} borderRadius={6} />
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
  mainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 6,
  },
  mainValue: {
    fontSize: 40,
    fontWeight: '800',
    lineHeight: 48,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  subLabel: {
    fontSize: 13,
    color: '#9E9E9E',
  },
})
