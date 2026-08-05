export const ATHLETE_PROFILES = {
  beginner: {
    label: 'Je commence',
    description: '1 à 2 fois par semaine',
    emoji: '🌱',
    weeklyActivityGoal: 2,
    sleepGoal: 7.5,
  },
  regular: {
    label: 'Régulier',
    description: '3 à 4 fois par semaine',
    emoji: '💪',
    weeklyActivityGoal: 3,
    sleepGoal: 8.0,
  },
  serious: {
    label: 'Sérieux',
    description: '5 fois et plus par semaine',
    emoji: '🔥',
    weeklyActivityGoal: 5,
    sleepGoal: 8.5,
  },
  competition: {
    label: 'Compétition',
    description: 'Je prépare un événement',
    emoji: '🏅',
    weeklyActivityGoal: 6,
    sleepGoal: 9.0,
  },
} as const

export type AthleteProfileKey = keyof typeof ATHLETE_PROFILES
