export const SPORTS = [
  { id: 'running',    label: 'Course à pied', emoji: '🏃', healthKitType: 'HKWorkoutActivityTypeRunning' },
  { id: 'cycling',    label: 'Vélo',          emoji: '🚴', healthKitType: 'HKWorkoutActivityTypeCycling' },
  { id: 'swimming',   label: 'Natation',      emoji: '🏊', healthKitType: 'HKWorkoutActivityTypeSwimming' },
  { id: 'strength',   label: 'Musculation',   emoji: '🏋️', healthKitType: 'HKWorkoutActivityTypeTraditionalStrengthTraining' },
  { id: 'hiking',     label: 'Randonnée',     emoji: '🥾', healthKitType: 'HKWorkoutActivityTypeHiking' },
  { id: 'yoga',       label: 'Yoga',          emoji: '🧘', healthKitType: 'HKWorkoutActivityTypeYoga' },
  { id: 'tennis',     label: 'Tennis',        emoji: '🎾', healthKitType: 'HKWorkoutActivityTypeTennis' },
  { id: 'soccer',     label: 'Football',      emoji: '⚽', healthKitType: 'HKWorkoutActivityTypeSoccer' },
  { id: 'basketball', label: 'Basketball',    emoji: '🏀', healthKitType: 'HKWorkoutActivityTypeBasketball' },
  { id: 'rowing',     label: 'Aviron',        emoji: '🚣', healthKitType: 'HKWorkoutActivityTypeRowing' },
  { id: 'crossfit',   label: 'CrossFit',      emoji: '💪', healthKitType: 'HKWorkoutActivityTypeCrossTraining' },
  { id: 'triathlon',  label: 'Triathlon',     emoji: '🏅', healthKitType: 'HKWorkoutActivityTypeTriathlon' },
] as const

export type SportId = typeof SPORTS[number]['id']
