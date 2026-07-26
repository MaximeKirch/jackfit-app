import { Colors } from '@/shared/constants/tokens'
import BaseUma from '@assets/uma_base_pixel_art.png'
import SleepyUma from '@assets/uma_sleepy.png'
import TiredUma from '@assets/uma_tired.png'

export type PetStatus = 'NEW' | 'PEAK' | 'GOOD' | 'TIRED' | 'LAZY' | 'OVERREACHED'

export interface PetState {
  status: PetStatus
  score:  number
  color:  string
  label:  string
  asset:  number
}

export const PET_STATES: Record<PetStatus, Omit<PetState, 'score'>> = {
  NEW:         { status: 'NEW',         color: Colors.pet.NEW,         label: 'On se découvre',  asset: BaseUma   },
  PEAK:        { status: 'PEAK',        color: Colors.pet.PEAK,        label: 'En pleine forme', asset: BaseUma   },
  GOOD:        { status: 'GOOD',        color: Colors.pet.GOOD,        label: 'Bonne semaine',   asset: BaseUma   },
  TIRED:       { status: 'TIRED',       color: Colors.pet.TIRED,       label: 'Fatigué',         asset: TiredUma  },
  LAZY:        { status: 'LAZY',        color: Colors.pet.LAZY,        label: 'Trop de repos',   asset: SleepyUma },
  OVERREACHED: { status: 'OVERREACHED', color: Colors.pet.OVERREACHED, label: 'Surmenage',       asset: BaseUma   },
}
