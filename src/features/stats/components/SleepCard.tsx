import { View, Text, StyleSheet } from 'react-native'
import { Card } from '@/shared/components/Card'
import { Skeleton } from '@/shared/components/Skeleton'
import { Colors, Typography } from '@/shared/constants/tokens'
import type { SleepStats } from '../hooks/useStats'

const qualityLabel = (avgHours: number, targetHours: number): string => {
  const ratio = avgHours / targetHours
  if (ratio >= 0.93) return 'Excellent'
  if (ratio >= 0.81) return 'Correct'
  if (ratio >= 0.625) return 'Insuffisant'
  return 'Mauvais'
}

interface SleepCardProps {
  stats: SleepStats
  accentColor: string
}

export const SleepCard = ({ stats, accentColor }: SleepCardProps) => {
  const color = stats.nightCount > 0 ? accentColor : Colors.stone
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
    fontSize: Typography.xs,
    fontFamily: 'Inter-SemiBold',
    color: Colors.stone,
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
    fontFamily: 'Inter-SemiBold',
    lineHeight: 48,
  },
  badge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: Typography.sm,
    fontFamily: 'Inter-SemiBold',
    color: Colors.white,
  },
  subLabel: {
    fontSize: Typography.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.stone,
  },
})
