import { useState, useEffect, useCallback, useRef } from 'react'
import { AppState, type AppStateStatus } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import {
  useHealthkitAuthorization,
  queryWorkoutSamples,
  queryCategorySamples,
  queryStatisticsForQuantity,
  AuthorizationRequestStatus,
  WorkoutTypeIdentifier,
} from '@kingstinct/react-native-healthkit'
import { transformWorkout, transformSleepSamples, deduplicateWorkouts } from '../utils/healthTransform'
import type { HealthSummary, WorkoutData } from '@/shared/types/health.types'

const LAST_SYNCED_WORKOUT_KEY = 'last_synced_workout_date'

const READ_TYPES = [
  WorkoutTypeIdentifier,
  'HKCategoryTypeIdentifierSleepAnalysis',
  'HKQuantityTypeIdentifierStepCount',
] as const

export const useHealthData = () => {
  const [data, setData] = useState<HealthSummary | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [justCompletedWorkout, setJustCompletedWorkout] = useState(false)

  const [authStatus, requestAuth] = useHealthkitAuthorization({ toRead: READ_TYPES })
  const appState = useRef(AppState.currentState)
  const celebrationTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const checkForNewWorkout = useCallback(async (workouts: WorkoutData[]) => {
    if (workouts.length === 0) return

    const mostRecent = workouts.reduce((latest, w) =>
      new Date(w.date) > new Date(latest.date) ? w : latest
    )

    const lastSyncedDate = await AsyncStorage.getItem(LAST_SYNCED_WORKOUT_KEY)

    if (!lastSyncedDate || new Date(mostRecent.date) > new Date(lastSyncedDate)) {
      setJustCompletedWorkout(true)
      await AsyncStorage.setItem(LAST_SYNCED_WORKOUT_KEY, mostRecent.date)

      if (celebrationTimer.current) clearTimeout(celebrationTimer.current)
      celebrationTimer.current = setTimeout(() => setJustCompletedWorkout(false), 3000)
    }
  }, [])

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const now = new Date()
      const today = new Date(now)
      today.setHours(0, 0, 0, 0)
      const dayOfWeek = today.getDay() // 0=Sun … 6=Sat
      const offsetToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
      const daysElapsedThisWeek = dayOfWeek === 0 ? 6 : dayOfWeek - 1 // Mon=0, Tue=1 … Sun=6
      const monday = new Date(today)
      monday.setDate(today.getDate() + offsetToMonday)
      const dateFilter = { date: { startDate: monday, endDate: now } }

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

      const transformedWorkouts = deduplicateWorkouts(workouts).map(transformWorkout)

      setData({
        workouts: transformedWorkouts,
        sleep: transformSleepSamples(sleepSamples),
        steps: Math.round(stepsResult.sumQuantity?.quantity ?? 0),
        weeklyScore: 0,
        daysElapsedThisWeek,
      })

      void checkForNewWorkout(transformedWorkouts)
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

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState: AppStateStatus) => {
      if (appState.current !== 'active' && nextState === 'active') {
        void fetchData()
      }
      appState.current = nextState
    })
    return () => subscription.remove()
  }, [fetchData])

  useEffect(() => {
    return () => {
      if (celebrationTimer.current) clearTimeout(celebrationTimer.current)
    }
  }, [])

  return { data, isLoading, error, refetch: fetchData, justCompletedWorkout }
}
