import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useTranslation } from 'react-i18next'
import { useStats } from '@/features/stats/hooks/useStats'
import { PET_STATES } from '@/shared/types/pet.types'
import { Colors, Radius, Spacing, Typography } from '@/shared/constants/tokens'
import { ActivityCard, ActivityCardSkeleton } from '@/features/stats/components/ActivityCard'
import { SleepCard, SleepCardSkeleton } from '@/features/stats/components/SleepCard'
import { ConsistencyCard, ConsistencyCardSkeleton } from '@/features/stats/components/ConsistencyCard'
import { HealthPermissionDenied } from '@/features/health/components/HealthPermissionDenied'
import { FadeInOnFocus } from '@/shared/components/FadeInOnFocus'

export default function StatsScreen() {
  const { t } = useTranslation()
  const { stats, isLoading, error, permissionDenied, score, status } = useStats()
  const { color } = PET_STATES[status]

  if (permissionDenied) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        <FadeInOnFocus>
          <HealthPermissionDenied body={t('stats.no_health_access')} />
        </FadeInOnFocus>
      </SafeAreaView>
    )
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <FadeInOnFocus>
          <Text style={styles.error}>{t('stats.health_read_error')}</Text>
        </FadeInOnFocus>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <FadeInOnFocus>
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={[styles.scoreBanner, { backgroundColor: color }]}>
            <Text style={styles.scoreLabel}>{t('stats.week_score')}</Text>
            <Text style={styles.scoreValue}>{score}/100</Text>
          </View>

          {isLoading || stats === null ? (
            <>
              <ActivityCardSkeleton />
              <SleepCardSkeleton />
              <ConsistencyCardSkeleton />
            </>
          ) : (
            <>
              <ActivityCard stats={stats.activity} accentColor={color} />
              <SleepCard stats={stats.sleep} accentColor={color} />
              <ConsistencyCard stats={stats.consistency} accentColor={color} />
            </>
          )}
        </ScrollView>
      </FadeInOnFocus>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.linen,
  },
  scroll: {
    padding: Spacing.md,
    gap: Spacing.sm,
    paddingBottom: Spacing.xl,
  },
  scoreBanner: {
    borderRadius: Radius.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Typography.sm,
    color: Colors.white,
  },
  scoreValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: Typography.xxl,
    color: Colors.white,
  },
  error: {
    fontFamily: 'Inter-Regular',
    fontSize: Typography.base,
    color: '#FF1744',
    textAlign: 'center',
    paddingHorizontal: 24,
  },
})
