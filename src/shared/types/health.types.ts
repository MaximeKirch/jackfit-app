export interface WorkoutData {
  type: string
  duration: number
  calories: number
  heartRate?: number
  date: string
}

export interface SleepData {
  duration: number
  quality: 'poor' | 'fair' | 'good' | 'excellent'
  date: string
}

export interface HealthSummary {
  workouts: WorkoutData[]
  sleep: SleepData[]
  steps: number
  weeklyScore: number
}
