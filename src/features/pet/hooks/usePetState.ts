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
    void syncScore(data).then(setScoreResult).catch(console.error)
  }, [data, setScoreResult])

  return {
    isLoading,
    error,
    refetch,
    permissionDenied,
    requestAuth,
    breakdown,
    justCompletedWorkout,
    hasEnoughData: data ? hasEnoughHealthData(data) : hasEnoughData,
  }
}
