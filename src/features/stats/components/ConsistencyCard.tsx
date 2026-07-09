import { View, Text, StyleSheet } from 'react-native'
import { Card } from '@/shared/components/Card'
import { Skeleton } from '@/shared/components/Skeleton'
import type { ConsistencyStats } from '../hooks/useStats'

const DAY_LABELS = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

// "YYYY-MM-DD" in local timezone
const toLocalDateKey = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const getWeekDays = (): Date[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const day = today.getDay() // 0=Sun, 1=Mon, …, 6=Sat
  const offset = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + offset)

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    return d
  })
}

interface ConsistencyCardProps {
  stats: ConsistencyStats
  accentColor: string
}

export const ConsistencyCard = ({ stats, accentColor }: ConsistencyCardProps) => {
  const weekDays = getWeekDays()
  const today = toLocalDateKey(new Date())

  return (
    <Card>
      <Text style={styles.label}>RÉGULARITÉ</Text>
      <Text style={[styles.mainValue, { color: accentColor }]}>
        {stats.activeDatesThisWeek.size}
        <Text style={styles.mainValueSub}> / {stats.targetDays} jours</Text>
      </Text>
      <Text style={styles.subLabel}>jours actifs cette semaine</Text>

      <View style={styles.dots}>
        {weekDays.map((day, i) => {
          const key = toLocalDateKey(day)
          const isActive = stats.activeDatesThisWeek.has(key)
          const isFuture = key > today

          return (
            <View key={key} style={styles.dotWrapper}>
              <View
                style={[
                  styles.dot,
                  isActive
                    ? { backgroundColor: accentColor }
                    : isFuture
                      ? styles.dotFuture
                      : styles.dotEmpty,
                ]}
              />
              <Text style={[styles.dayLabel, isFuture && styles.dayLabelFuture]}>
                {DAY_LABELS[i]}
              </Text>
            </View>
          )
        })}
      </View>
    </Card>
  )
}

export const ConsistencyCardSkeleton = () => (
  <Card>
    <Skeleton width={90} height={12} borderRadius={6} />
    <View style={{ height: 10 }} />
    <Skeleton width={140} height={36} borderRadius={8} />
    <View style={{ height: 6 }} />
    <Skeleton width={160} height={12} borderRadius={6} />
    <View style={{ height: 16 }} />
    <View style={styles.dots}>
      {DAY_LABELS.map((_, i) => (
        <View key={i} style={styles.dotWrapper}>
          <Skeleton width={28} height={28} borderRadius={14} />
          <View style={{ height: 4 }} />
          <Skeleton width={12} height={10} borderRadius={4} />
        </View>
      ))}
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
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 44,
  },
  mainValueSub: {
    fontSize: 22,
    fontWeight: '600',
  },
  subLabel: {
    fontSize: 13,
    color: '#9E9E9E',
    marginBottom: 16,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dotWrapper: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  dotEmpty: {
    backgroundColor: '#EEEEEE',
  },
  dotFuture: {
    backgroundColor: '#F5F5F5',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  dayLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    fontWeight: '600',
  },
  dayLabelFuture: {
    color: '#BDBDBD',
  },
})
