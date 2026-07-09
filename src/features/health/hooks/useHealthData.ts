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
      const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const dateFilter = { date: { startDate: sevenDaysAgo, endDate: now } }

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

      setData({
        workouts: deduplicateWorkouts(workouts).map(transformWorkout),
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
