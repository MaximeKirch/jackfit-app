import { useEffect, useRef, useState } from 'react'
import { useHealthData } from '@/features/health/hooks/useHealthData'
import { syncScore } from '@/features/health/api/scoreApi'
import { usePetStore } from '@/shared/stores/petStore'
import { posthog } from '@/config/posthog'
import { hasEnoughHealthData, countDistinctDaysWithData, DAYS_REQUIRED_FOR_SCORE } from '../utils/scoring'
import type { StageName } from '../utils/stages'

export const usePetState = () => {
  const { data, isLoading, error, refetch, permissionDenied, requestAuth, justCompletedWorkout } = useHealthData()
  const setScoreResult = usePetStore((s) => s.setScoreResult)
  const breakdown = usePetStore((s) => s.breakdown)
  const hasEnoughData = usePetStore((s) => s.hasEnoughData)
  const currentStage = usePetStore((s) => s.currentStage)
  const totalXp = usePetStore((s) => s.totalXp)
  const prevStageRef = useRef<StageName | null>(null)
  const [hasFreshScore, setHasFreshScore] = useState(false)

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
    void (async () => {
      try {
        const result = await syncScore(data)
        setScoreResult(result)
      } catch (err) {
        posthog.captureException(err, { operation: 'score_sync' })
      } finally {
        setHasFreshScore(true)
      }
    })()
  }, [data, setScoreResult])

  return {
    isLoading,
    isDataReady: data !== null,
    hasFreshScore,
    error,
    refetch,
    permissionDenied,
    requestAuth,
    breakdown,
    justCompletedWorkout,
    hasEnoughData: data ? hasEnoughHealthData(data) : hasEnoughData,
    daysWithData: data ? countDistinctDaysWithData(data) : 0,
    daysRequired: DAYS_REQUIRED_FOR_SCORE,
  }
}
