export const ATHLETE_PROFILES = {
  beginner: {
    emoji: '🌱',
    weeklyActivityGoal: 2,
    sleepGoal: 7.5,
  },
  regular: {
    emoji: '💪',
    weeklyActivityGoal: 3,
    sleepGoal: 8.0,
  },
  serious: {
    emoji: '🔥',
    weeklyActivityGoal: 5,
    sleepGoal: 8.5,
  },
  competition: {
    emoji: '🏅',
    weeklyActivityGoal: 6,
    sleepGoal: 9.0,
  },
} as const

export type AthleteProfileKey = keyof typeof ATHLETE_PROFILES
