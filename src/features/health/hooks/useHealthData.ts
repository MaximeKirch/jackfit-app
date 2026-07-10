import { useState, useEffect, useCallback } from 'react'
import {
  useHealthkitAuthorization,
  queryWorkoutSamples,
  queryCategorySamples,
  queryStatisticsForQuantity,
  AuthorizationRequestStatus,
  WorkoutTypeIdentifier,
} from '@kingstinct/react-native-healthkit'
import { transformWorkout, transformSleepSamples, deduplicateWorkouts } from '../utils/healthTransform'
import type { HealthSummary } from '@/shared/types/health.types'

const READ_TYPES = [
  WorkoutTypeIdentifier,
  'HKCategoryTypeIdentifierSleepAnalysis',
  'HKQuantityTypeIdentifierStepCount',
] as const

export const useHealthData = () => {
  const [data, setData] = useState<HealthSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const [authStatus, requestAuth] = useHealthkitAuthorization({ toRead: READ_TYPES })

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const now = new Date()
      const today = new Date(now)
      today.setHours(0, 0, 0, 0)
      const dayOfWeek = today.getDay() // 0=Sun … 6=Sat
      const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      const monday = new Date(today)
      monday.setDate(today.getDate() + offsetToMonday)
      const dateFilter = { date: { startDate: monday, endDate: now } }

      console.log('[HealthData] window:', monday.toISOString(), '→', now.toISOString())

      const [workouts, sleepSamples, stepsResult] = await Promise.all([
        queryWorkoutSamples({ filter: dateFilter, limit: -1 }),
        queryCategorySamples('HKCategoryTypeIdentifierSleepAnalysis', {
          filter: dateFilter,
          limit: -1,
        }),
        queryStatisticsForQuantity('HKQuantityTypeIdentifierStepCount', ['cumulativeSum'], {
          filter: dateFilter,
          unit: 'count',
        }),
      ])

      const raw = workouts
      const deduped = deduplicateWorkouts(raw)
      console.log('[HealthData] raw workouts:', raw.length)
      raw.forEach((w) =>
        console.log(`  raw: ${w.workoutActivityType} | start=${w.startDate.toISOString()} | duration=${Math.round(w.duration.quantity / 60)}min | cal=${w.totalEnergyBurned?.quantity ?? 0}`)
      )
      console.log('[HealthData] after dedup:', deduped.length)
      deduped.forEach((w) =>
        console.log(`  dedup: ${w.workoutActivityType} | start=${w.startDate.toISOString()} | duration=${Math.round(w.duration.quantity / 60)}min | cal=${w.totalEnergyBurned?.quantity ?? 0}`)
      )

      setData({
        workouts: deduped.map(transformWorkout),
        sleep: transformSleepSamples(sleepSamples),
        steps: Math.round(stepsResult.sumQuantity?.quantity ?? 0),
        weeklyScore: 0, // computed in step 3 (scoring algorithm)
      })
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch health data'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authStatus === null) return
    if (authStatus === AuthorizationRequestStatus.shouldRequest) {
      void requestAuth()
      return
    }
    void fetchData()
  }, [authStatus, fetchData, requestAuth])

  return { data, isLoading, error, refetch: fetchData }
}
