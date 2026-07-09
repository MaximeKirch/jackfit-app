import { WorkoutActivityType, CategoryValueSleepAnalysis } from '@kingstinct/react-native-healthkit'
import type { WorkoutProxyTyped, CategorySampleTyped } from '@kingstinct/react-native-healthkit'
import type { WorkoutData, SleepData } from '@/shared/types/health.types'

const WORKOUT_TYPE_MAP: Partial<Record<WorkoutActivityType, string>> = {
  [WorkoutActivityType.running]: 'running',
  [WorkoutActivityType.cycling]: 'cycling',
  [WorkoutActivityType.swimming]: 'swimming',
  [WorkoutActivityType.functionalStrengthTraining]: 'strength',
  [WorkoutActivityType.traditionalStrengthTraining]: 'strength',
}

export const transformWorkout = (workout: WorkoutProxyTyped): WorkoutData => ({
  type: WORKOUT_TYPE_MAP[workout.workoutActivityType] ?? 'default',
  duration: Math.round(workout.duration.quantity / 60),
  calories: Math.round(workout.totalEnergyBurned?.quantity ?? 0),
  date: workout.startDate.toISOString(),
})

// Strava + Coros (and other sync apps) both write the same workout to HealthKit.
// Deduplicate by grouping workouts with the same activity type and start time
// within a 2-minute window, keeping the one with the most complete calorie data.
export const deduplicateWorkouts = (
  workouts: readonly WorkoutProxyTyped[],
): readonly WorkoutProxyTyped[] => {
  const BUCKET_MS = 2 * 60 * 1000
  const groups = new Map<string, WorkoutProxyTyped>()

  for (const workout of workouts) {
    const bucket = Math.floor(workout.startDate.getTime() / BUCKET_MS)
    const key = `${workout.workoutActivityType}-${bucket}`
    const existing = groups.get(key)
    const calories = workout.totalEnergyBurned?.quantity ?? 0
    if (!existing || calories > (existing.totalEnergyBurned?.quantity ?? 0)) {
      groups.set(key, workout)
    }
  }

  return Array.from(groups.values()).sort(
    (a, b) => b.startDate.getTime() - a.startDate.getTime(),
  )
}

const ASLEEP_VALUES = new Set([
  CategoryValueSleepAnalysis.asleepUnspecified,
  CategoryValueSleepAnalysis.asleepCore,
  CategoryValueSleepAnalysis.asleepDeep,
  CategoryValueSleepAnalysis.asleepREM,
])

const sleepQualityFromHours = (hours: number): SleepData['quality'] => {
  if (hours >= 7.5) return 'excellent'
  if (hours >= 6.5) return 'good'
  if (hours >= 5) return 'fair'
  return 'poor'
}

type SleepSample = CategorySampleTyped<'HKCategoryTypeIdentifierSleepAnalysis'>

export const transformSleepSamples = (samples: readonly SleepSample[]): SleepData[] => {
  // Group actual sleep (not inBed/awake) by wake-up day (endDate), sum durations
  const byDay = new Map<string, number>()

  for (const sample of samples) {
    if (!ASLEEP_VALUES.has(sample.value)) continue

    const key = sample.endDate.toISOString().slice(0, 10)
    const ms = sample.endDate.getTime() - sample.startDate.getTime()
    byDay.set(key, (byDay.get(key) ?? 0) + ms)
  }

  return Array.from(byDay.entries()).map(([date, totalMs]) => {
    const duration = Math.round((totalMs / (1000 * 60 * 60)) * 10) / 10
    return { duration, quality: sleepQualityFromHours(duration), date }
  })
}
