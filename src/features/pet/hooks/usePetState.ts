import { useEffect } from 'react'
import { useHealthData } from '@/features/health/hooks/useHealthData'
import { usePetStore } from '@/shared/stores/petStore'
import { calculateScore, scoreToStatus } from '../utils/scoring'

export const usePetState = () => {
  const { data, isLoading, error } = useHealthData()
  const scoringConfig = usePetStore((s) => s.scoringConfig)
  const setScore = usePetStore((s) => s.setScore)
  const setStatus = usePetStore((s) => s.setStatus)

  useEffect(() => {
    if (!data) return
    const score = calculateScore(data, scoringConfig)
    setScore(score)
    setStatus(scoreToStatus(score))
  }, [data, scoringConfig, setScore, setStatus])

  return { isLoading, error }
}
