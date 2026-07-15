import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
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
  lastVisit: string | null
  setStatus: (status: PetStatus) => void
  setScore: (score: number) => void
  setLastMessage: (message: string) => void
  setScoringConfig: (config: ScoringConfig) => void
  getPreviousVisit: () => string | null
  recordVisit: () => void
}

export const usePetStore = create<PetStore>()(
  persist(
    (set, get) => ({
      status: 'NEW',
      score: 0,
      lastMessage: '',
      scoringConfig: DEFAULT_SCORING_CONFIG,
      lastVisit: null,

      setStatus: (status) => set({ status }),
      setScore: (score) => set({ score }),
      setLastMessage: (lastMessage) => set({ lastMessage }),
      setScoringConfig: (scoringConfig) => set({ scoringConfig }),

      getPreviousVisit: () => get().lastVisit,
      recordVisit: () => set({ lastVisit: new Date().toISOString() }),
    }),
    {
      name: 'pet-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
