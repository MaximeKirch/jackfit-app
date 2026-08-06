import { View, Text, StyleSheet } from 'react-native'
import { useTranslation } from 'react-i18next'
import { Card } from '@/shared/components/Card'
import { Skeleton } from '@/shared/components/Skeleton'
import { Colors, Typography } from '@/shared/constants/tokens'
import type { ConsistencyStats } from '../hooks/useStats'

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
  const { t } = useTranslation()
  const weekDays = getWeekDays()
  const today = toLocalDateKey(new Date())
  const dayLabels = t('stats.consistency.day_labels', { returnObjects: true }) as string[]

  return (
    <Card>
      <Text style={styles.label}>{t('stats.consistency.title')}</Text>
      <Text style={[styles.mainValue, { color: accentColor }]}>
        {stats.activeDatesThisWeek.size}
        <Text style={styles.mainValueSub}> {t('stats.consistency.days_ratio_suffix', { target: stats.targetDays })}</Text>
      </Text>
      <Text style={styles.subLabel}>{t('stats.consistency.days_active')}</Text>

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
                {dayLabels[i]}
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
      {Array.from({ length: 7 }).map((_, i) => (
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
    fontSize: Typography.xs,
    fontFamily: 'Inter-SemiBold',
    color: Colors.stone,
    letterSpacing: 1,
    marginBottom: 4,
  },
  mainValue: {
    fontSize: 36,
    fontFamily: 'Inter-SemiBold',
    lineHeight: 44,
  },
  mainValueSub: {
    fontSize: 22,
    fontFamily: 'Inter-SemiBold',
  },
  subLabel: {
    fontSize: Typography.sm,
    fontFamily: 'Inter-Regular',
    color: Colors.stone,
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
    backgroundColor: Colors.sand,
  },
  dotFuture: {
    backgroundColor: Colors.linen,
    borderWidth: 1,
    borderColor: Colors.sand,
  },
  dayLabel: {
    fontSize: Typography.xs,
    fontFamily: 'Inter-SemiBold',
    color: Colors.stone,
  },
  dayLabelFuture: {
    color: Colors.stone,
    opacity: 0.5,
  },
})
