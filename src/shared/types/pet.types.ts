import { Colors } from '@/shared/constants/tokens'

export type PetStatus = 'PEAK' | 'GOOD' | 'TIRED' | 'LAZY' | 'OVERREACHED'

export interface PetState {
  status: PetStatus
  score: number
  color: string
  label: string
}

export const PET_STATES: Record<PetStatus, Omit<PetState, 'score'>> = {
  PEAK:        { status: 'PEAK',        color: Colors.pet.PEAK,        label: 'En pleine forme' },
  GOOD:        { status: 'GOOD',        color: Colors.pet.GOOD,        label: 'Bonne semaine' },
  TIRED:       { status: 'TIRED',       color: Colors.pet.TIRED,       label: 'Fatigué' },
  LAZY:        { status: 'LAZY',        color: Colors.pet.LAZY,        label: 'Trop de repos' },
  OVERREACHED: { status: 'OVERREACHED', color: Colors.pet.OVERREACHED, label: 'Surmenage' },
}
