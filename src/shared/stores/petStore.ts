import { create } from 'zustand'
import type { PetStatus } from '@/shared/types/pet.types'
import {
  DEFAULT_SCORING_CONFIG,
  type ScoringConfig,
} from '@/features/pet/utils/scoring'

interface PetStore {
  status: PetStatus
  score: number
  lastMessage: string
  scoringConfig: ScoringConfig
  setStatus: (status: PetStatus) => void
  setScore: (score: number) => void
  setLastMessage: (message: string) => void
  setScoringConfig: (config: ScoringConfig) => void
}

export const usePetStore = create<PetStore>((set) => ({
  status: 'GOOD',
  score: 0,
  lastMessage: '',
  scoringConfig: DEFAULT_SCORING_CONFIG,
  setStatus: (status) => set({ status }),
  setScore: (score) => set({ score }),
  setLastMessage: (lastMessage) => set({ lastMessage }),
  setScoringConfig: (scoringConfig) => set({ scoringConfig }),
}))
