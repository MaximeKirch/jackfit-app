export const SPORTS = [
  { id: 'running',    emoji: '🏃', healthKitType: 'HKWorkoutActivityTypeRunning' },
  { id: 'cycling',    emoji: '🚴', healthKitType: 'HKWorkoutActivityTypeCycling' },
  { id: 'swimming',   emoji: '🏊', healthKitType: 'HKWorkoutActivityTypeSwimming' },
  { id: 'strength',   emoji: '🏋️', healthKitType: 'HKWorkoutActivityTypeTraditionalStrengthTraining' },
  { id: 'hiking',     emoji: '🥾', healthKitType: 'HKWorkoutActivityTypeHiking' },
  { id: 'yoga',       emoji: '🧘', healthKitType: 'HKWorkoutActivityTypeYoga' },
  { id: 'tennis',     emoji: '🎾', healthKitType: 'HKWorkoutActivityTypeTennis' },
  { id: 'soccer',     emoji: '⚽', healthKitType: 'HKWorkoutActivityTypeSoccer' },
  { id: 'basketball', emoji: '🏀', healthKitType: 'HKWorkoutActivityTypeBasketball' },
  { id: 'rowing',     emoji: '🚣', healthKitType: 'HKWorkoutActivityTypeRowing' },
  { id: 'crossfit',   emoji: '💪', healthKitType: 'HKWorkoutActivityTypeCrossTraining' },
  { id: 'triathlon',  emoji: '🏅', healthKitType: 'HKWorkoutActivityTypeTriathlon' },
] as const

export type SportId = typeof SPORTS[number]['id']
