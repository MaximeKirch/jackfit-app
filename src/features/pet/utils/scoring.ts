import type { HealthSummary } from '@/shared/types/health.types'
import type { PetStatus } from '@/shared/types/pet.types'
import type { StageName } from '@/features/pet/utils/stages'

export interface ScoringConfig {
  weeklyTargetHours: number
  targetActiveDays: number
  targetSleepHours: number
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  weeklyTargetHours: 5,
  targetActiveDays: 4,
  targetSleepHours: 8,
}

export interface ScoreBreakdown {
  sleep:     number // 0-100
  activity:  number // 0-100
  wellbeing: number // 0-100
  total:     number
}

export interface ScoreResult {
  score: number
  status: PetStatus
  breakdown: ScoreBreakdown
  hasEnoughData: boolean
  totalXp: number
  currentStage: StageName
}

export const hasEnoughHealthData = (health: HealthSummary): boolean =>
  health.workouts.length + health.sleep.length >= 3
