import type { HealthSummary, WorkoutData, SleepData } from '@/shared/types/health.types'
import type { PetStatus } from '@/shared/types/pet.types'

export interface ScoringConfig {
  weeklyTargetHours: number // 5 pour un coureur de 5km, 15+ pour un Ironman
  targetActiveDays: number  // jours d'entraînement visés par semaine
  targetSleepHours: number  // heures de sommeil visées par nuit
}

export const DEFAULT_SCORING_CONFIG: ScoringConfig = {
  weeklyTargetHours: 5,
  targetActiveDays: 4,
  targetSleepHours: 8,
}

const DEFAULT_INTENSITY = 0.8

const WORKOUT_INTENSITY: Partial<Record<string, number>> = {
  running: 1.2,
  cycling: 1.0,
  swimming: 1.3,
  strength: 0.9,
}

const scoreActivity = (workouts: WorkoutData[], weeklyTargetHours: number): number => {
  if (workouts.length === 0) return 0
  const raw = workouts.reduce((acc, w) => {
    const intensity = WORKOUT_INTENSITY[w.type.toLowerCase()] ?? DEFAULT_INTENSITY
    return acc + (w.duration / 60) * intensity
  }, 0)
  return Math.min((raw / weeklyTargetHours) * 40, 40)
}

const scoreSleep = (sleep: SleepData[], targetSleepHours: number): number => {
  if (sleep.length === 0) return 0
  const avg = sleep.reduce((acc, s) => acc + s.duration, 0) / sleep.length
  return Math.min((avg / targetSleepHours) * 40, 40)
}

const scoreConsistency = (workouts: WorkoutData[], targetActiveDays: number): number => {
  const activeDays = new Set(workouts.map((w) => w.date.slice(0, 10))).size
  return Math.min((activeDays / targetActiveDays) * 20, 20)
}

export const calculateScore = (
  health: HealthSummary,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG,
): number => {
  const daysElapsed = health.daysElapsedThisWeek ?? 6

  // Semaine qui vient de commencer : score GOOD par défaut, aucune donnée attendue
  if (daysElapsed === 0) return 65

  const weekProgress = daysElapsed / 7
  const proRatedHours = config.weeklyTargetHours * weekProgress
  const proRatedDays  = config.targetActiveDays  * weekProgress

  return Math.round(
    scoreActivity(health.workouts, proRatedHours) +
    scoreSleep(health.sleep, config.targetSleepHours) +
    scoreConsistency(health.workouts, proRatedDays),
  )
}

export interface ScoreBreakdown {
  sleep:     number // 0-100
  activity:  number // 0-100
  wellbeing: number // 0-100
  total:     number
}

export const calculateScoreBreakdown = (
  health: HealthSummary,
  config: ScoringConfig = DEFAULT_SCORING_CONFIG,
): ScoreBreakdown => {
  const daysElapsed = health.daysElapsedThisWeek ?? 6

  if (daysElapsed === 0) {
    return { sleep: 50, activity: 50, wellbeing: 50, total: 65 }
  }

  const weekProgress    = daysElapsed / 7
  const proRatedHours   = config.weeklyTargetHours * weekProgress
  const proRatedDays    = config.targetActiveDays  * weekProgress

  const activityRaw    = scoreActivity(health.workouts, proRatedHours)
  const sleepRaw       = scoreSleep(health.sleep, config.targetSleepHours)
  const consistencyRaw = scoreConsistency(health.workouts, proRatedDays)

  return {
    sleep:     Math.round((sleepRaw / 40) * 100),
    activity:  Math.round((activityRaw / 40) * 100),
    wellbeing: Math.round(((activityRaw + consistencyRaw) / 60) * 100),
    total:     Math.round(activityRaw + sleepRaw + consistencyRaw),
  }
}

export const hasEnoughHealthData = (health: HealthSummary): boolean =>
  health.workouts.length + health.sleep.length >= 3

export const scoreToStatus = (score: number, hasEnoughData: boolean): PetStatus => {
  if (!hasEnoughData) return 'NEW'
  if (score >= 80) return 'PEAK'
  if (score >= 60) return 'GOOD'
  if (score >= 40) return 'TIRED'
  if (score >= 20) return 'LAZY'
  return 'OVERREACHED'
}
