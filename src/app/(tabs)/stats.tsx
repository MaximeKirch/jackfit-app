import { ScrollView, View, Text, StyleSheet } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useStats } from '@/features/stats/hooks/useStats'
import { PET_STATES } from '@/shared/types/pet.types'
import {
  ActivityCard,
  ActivityCardSkeleton,
} from '@/features/stats/components/ActivityCard'
import { SleepCard, SleepCardSkeleton } from '@/features/stats/components/SleepCard'
import {
  ConsistencyCard,
  ConsistencyCardSkeleton,
} from '@/features/stats/components/ConsistencyCard'

export default function StatsScreen() {
  const { stats, isLoading, error, score, status } = useStats()
  const { color } = PET_STATES[status]

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.error}>Impossible de lire les données HealthKit.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.scoreBanner, { backgroundColor: color }]}>
          <Text style={styles.scoreLabel}>Score de la semaine</Text>
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
            <SleepCard stats={stats.sleep} />
            <ConsistencyCard stats={stats.consistency} accentColor={color} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scroll: {
    padding: 16,
    gap: 12,
    paddingBottom: 32,
  },
  scoreBanner: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scoreLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scoreValue: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  error: {
    color: '#FF1744',
    textAlign: 'center',
    paddingHorizontal: 24,
    fontSize: 16,
  },
})
