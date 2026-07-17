import { useEffect, useRef } from 'react'
import { useHealthData } from '@/features/health/hooks/useHealthData'
import { syncScore } from '@/features/health/api/scoreApi'
import { usePetStore } from '@/shared/stores/petStore'
import { posthog } from '@/config/posthog'
import { hasEnoughHealthData } from '../utils/scoring'
import type { StageName } from '../utils/stages'

export const usePetState = () => {
  const { data, isLoading, error, refetch, permissionDenied, requestAuth, justCompletedWorkout } = useHealthData()
  const setScoreResult = usePetStore((s) => s.setScoreResult)
  const breakdown = usePetStore((s) => s.breakdown)
  const hasEnoughData = usePetStore((s) => s.hasEnoughData)
  const currentStage = usePetStore((s) => s.currentStage)
  const totalXp = usePetStore((s) => s.totalXp)
  const prevStageRef = useRef<StageName | null>(null)

  useEffect(() => {
    if (prevStageRef.current === null) {
      prevStageRef.current = currentStage
      return
    }
    if (prevStageRef.current !== currentStage) {
      posthog.capture('xp_stage_changed', {
        from_stage: prevStageRef.current,
        to_stage: currentStage,
        total_xp: totalXp,
      })
      prevStageRef.current = currentStage
    }
  }, [currentStage, totalXp])

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
