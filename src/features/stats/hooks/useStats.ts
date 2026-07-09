import { useHealthData } from '@/features/health/hooks/useHealthData'
import { usePetStore } from '@/shared/stores/petStore'
import type { HealthSummary, WorkoutData } from '@/shared/types/health.types'

export interface ActivityStats {
  totalMinutes: number
  workoutCount: number
  topType: string | null
  totalCalories: number
  targetHours: number
}

export interface SleepStats {
  avgHours: number
  nightCount: number
  targetHours: number
}

export interface ConsistencyStats {
  // Local ISO date strings (e.g., "2026-07-07") of workouts in the current calendar week
  activeDatesThisWeek: ReadonlySet<string>
  // Total unique active days across the full 7-day rolling window (used for score/text)
  activeDaysTotal: number
  targetDays: number
}

export interface Stats {
  activity: ActivityStats
  sleep: SleepStats
  consistency: ConsistencyStats
}

const topWorkoutType = (workouts: WorkoutData[]): string | null => {
  if (workouts.length === 0) return null
  const counts = new Map<string, number>()
  for (const w of workouts) counts.set(w.type, (counts.get(w.type) ?? 0) + 1)
  let top = ''
  let max = 0
  for (const [type, count] of counts) {
    if (count > max) {
      max = count
      top = type
    }
  }
  return top || null
}

// Returns "YYYY-MM-DD" in the device's local timezone
const toLocalDateKey = (date: Date): string => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

const getMondayOfCurrentWeek = (): Date => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const day = today.getDay() // 0=Sun, 1=Mon, …, 6=Sat
  const offset = day === 0 ? -6 : 1 - day
  const monday = new Date(today)
  monday.setDate(today.getDate() + offset)
  return monday
}

const computeStats = (
  health: HealthSummary,
  config: { weeklyTargetHours: number; targetActiveDays: number; targetSleepHours: number },
): Stats => {
  const totalMinutes = health.workouts.reduce((acc, w) => acc + w.duration, 0)
  const totalCalories = health.workouts.reduce((acc, w) => acc + w.calories, 0)

  // All unique active days in the 7-day rolling window (local dates)
  const allActiveDates = new Set(
    health.workouts.map((w) => toLocalDateKey(new Date(w.date))),
  )

  // Subset: only days within the current calendar week (Mon–Sun).
  // Compare as strings — "YYYY-MM-DD" lexicographic order is correct and avoids
  // the UTC-vs-local midnight mismatch that ms-based comparisons introduce.
  const monday = getMondayOfCurrentWeek()
  const mondayKey = toLocalDateKey(monday)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  const sundayKey = toLocalDateKey(sunday)
  const activeDatesThisWeek = new Set(
    [...allActiveDates].filter((dk) => dk >= mondayKey && dk <= sundayKey),
  )

  const nightCount = health.sleep.length
  const avgHours =
    nightCount > 0
      ? Math.round((health.sleep.reduce((acc, s) => acc + s.duration, 0) / nightCount) * 10) / 10
      : 0

  return {
    activity: {
      totalMinutes,
      workoutCount: health.workouts.length,
      topType: topWorkoutType(health.workouts),
      totalCalories,
      targetHours: config.weeklyTargetHours,
    },
    sleep: { avgHours, nightCount, targetHours: config.targetSleepHours },
    consistency: {
      activeDatesThisWeek,
      activeDaysTotal: allActiveDates.size,
      targetDays: config.targetActiveDays,
    },
  }
}

export const useStats = () => {
  const { data, isLoading, error } = useHealthData()
  const scoringConfig = usePetStore((s) => s.scoringConfig)
  const score = usePetStore((s) => s.score)
  const status = usePetStore((s) => s.status)
  const stats = data ? computeStats(data, scoringConfig) : null
  return { stats, isLoading, error, score, status }
}
