import { useEffect } from 'react'
import { useHealthData } from '@/features/health/hooks/useHealthData'
import { usePetStore } from '@/shared/stores/petStore'
import { calculateScore, calculateScoreBreakdown, scoreToStatus } from '../utils/scoring'

export const usePetState = () => {
  const { data, isLoading, error, justCompletedWorkout } = useHealthData()
  const scoringConfig = usePetStore((s) => s.scoringConfig)
  const setScore = usePetStore((s) => s.setScore)
  const setStatus = usePetStore((s) => s.setStatus)

  useEffect(() => {
    if (!data) return
    const score = calculateScore(data, scoringConfig)
    setScore(score)
    setStatus(scoreToStatus(score))
  }, [data, scoringConfig, setScore, setStatus])

  const breakdown = data ? calculateScoreBreakdown(data, scoringConfig) : null

  return { isLoading, error, breakdown, justCompletedWorkout }
}
