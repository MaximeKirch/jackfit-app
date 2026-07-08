export type PetStatus = 'PEAK' | 'GOOD' | 'TIRED' | 'LAZY' | 'OVERREACHED'

export interface PetState {
  status: PetStatus
  score: number
  color: string
  label: string
}

export const PET_STATES: Record<PetStatus, Omit<PetState, 'score'>> = {
  PEAK: { status: 'PEAK', color: '#00C853', label: 'En pleine forme' },
  GOOD: { status: 'GOOD', color: '#69F0AE', label: 'Bonne semaine' },
  TIRED: { status: 'TIRED', color: '#FF6D00', label: 'Fatigué' },
  LAZY: { status: 'LAZY', color: '#FF1744', label: 'Trop de repos' },
  OVERREACHED: { status: 'OVERREACHED', color: '#B71C1C', label: 'Surmenage' },
}
