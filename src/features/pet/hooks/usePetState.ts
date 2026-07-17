import { useEffect } from 'react'
import { useHealthData } from '@/features/health/hooks/useHealthData'
import { syncScore } from '@/features/health/api/scoreApi'
import { usePetStore } from '@/shared/stores/petStore'
import { hasEnoughHealthData } from '../utils/scoring'

export const usePetState = () => {
  const { data, isLoading, error, refetch, permissionDenied, requestAuth, justCompletedWorkout } = useHealthData()
  const setScoreResult = usePetStore((s) => s.setScoreResult)
  const breakdown = usePetStore((s) => s.breakdown)
  const hasEnoughData = usePetStore((s) => s.hasEnoughData)

  useEffect(() => {
    if (!data) return
    console.log('[usePetState] health data loaded:', {
      workouts:            data.workouts.length,
      sleep:               data.sleep.length,
      steps:               data.steps,
      daysElapsedThisWeek: data.daysElapsedThisWeek,
      localHour:           data.localHour,
      hasEnough:           hasEnoughHealthData(data),
      workoutDates:        data.workouts.map((w) => w.date.slice(0, 10)),
      sleepDurations:      data.sleep.map((s) => s.duration),
    })
    void syncScore(data).then(setScoreResult).catch(console.error)
  }, [data, setScoreResult])

  return {
    isLoading,
    isDataReady: data !== null,
    error,
    refetch,
    permissionDenied,
    requestAuth,
    breakdown,
    justCompletedWorkout,
    hasEnoughData: data ? hasEnoughHealthData(data) : hasEnoughData,
  }
}
